const { ethers } = require("ethers"); // For ethers v5
const AWS = require("aws-sdk");
const asn1 = require("asn1.js");

// ASN.1 schema for DER-encoded ECDSA signature
const ECDSASignatureASN1 = asn1.define('ECDSASignature', function () {
    this.seq().obj(
        this.key('r').int(),
        this.key('s').int()
    );
});

class KMSWallet {
    constructor(kmsClient, keyId, provider) {
        this.kmsClient = kmsClient;
        this.keyId = keyId;
        this.provider = provider;
    }

    async getPublicKey() {
        const response = await this.kmsClient.getPublicKey({ KeyId: this.keyId }).promise();
        const publicKeyBuffer = response.PublicKey;
    
        // Extract the uncompressed public key (0x04 prefix + X and Y coordinates)
        const publicKeyHex = '0x04' + publicKeyBuffer.slice(-64).toString('hex');  // Last 64 bytes are X and Y
    
        // Ensure the public key starts with 0x04, indicating uncompressed form
        if (!publicKeyHex.startsWith('0x04')) {
            throw new Error('Invalid public key format: Uncompressed public key expected');
        }
    
        // Perform keccak256 on the public key (excluding the 0x04 prefix)
        const publicKeyHash = ethers.utils.keccak256('0x' + publicKeyHex.slice(4));  // Exclude the "0x04" prefix for hashing
    
        // Take the last 20 bytes of the hash to get the Ethereum address
        const ethAddress = '0x' + publicKeyHash.slice(-40);
    
        // Ensure the address is checksummed
        this.address = ethers.utils.getAddress(ethAddress);
    
        return this.address;
    }
    

    async signHash(hash) {
        if (hash.length !== 66) { // 66 characters (0x + 64 chars for 32 bytes)
            throw new Error("Hash must be 32 bytes.");
        }
    
        const response = await this.kmsClient.sign({
            KeyId: this.keyId,
            Message: Buffer.from(hash.slice(2), 'hex'),  // Strip "0x" and convert to Buffer
            MessageType: "DIGEST",
            SigningAlgorithm: "ECDSA_SHA_256",
        }).promise();
    
        const signatureDER = response.Signature;
    
        // Decode the DER-encoded signature into r and s components
        const decodedSignature = ECDSASignatureASN1.decode(signatureDER, 'der');
        const r = decodedSignature.r.toString(16).padStart(64, '0');  // Ensure it's 64 characters
        const s = decodedSignature.s.toString(16).padStart(64, '0');
    
        // Prevent signature malleability by adjusting the s-value if necessary
        // more here: https://medium.com/draftkings-engineering/signature-malleability-7a804429b14a
        const secp256k1N = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141");
        const halfN = secp256k1N / 2n;
        let adjustedS = s;
        if (BigInt(`0x${s}`) > halfN) {
            adjustedS = (secp256k1N - BigInt(`0x${s}`)).toString(16).padStart(64, '0');
        }
    
        // Perform public key recovery to determine v
        const publicKeyRecoveredV0 = ethers.utils.recoverPublicKey(hash, { r: '0x' + r, s: '0x' + adjustedS, v: 27 });
        const publicKeyRecoveredV1 = ethers.utils.recoverPublicKey(hash, { r: '0x' + r, s: '0x' + adjustedS, v: 28 });
    
        const expectedAddress = await this.getPublicKey();  // Get the expected Ethereum address
    
        let v;
        if (ethers.utils.computeAddress(publicKeyRecoveredV0).toLowerCase() === expectedAddress.toLowerCase()) {
            v = 27;
        } else if (ethers.utils.computeAddress(publicKeyRecoveredV1).toLowerCase() === expectedAddress.toLowerCase()) {
            v = 28;
        } else {
            throw new Error("Failed to recover public key and calculate correct v value");
        }
    
        return { r, s: adjustedS, v };
    }

    async signTransaction(transaction) {
        // Serialize the transaction to prepare for signing
        const unsignedTx = ethers.utils.serializeTransaction(transaction);
        const txHash = ethers.utils.keccak256(unsignedTx);  // Get the transaction hash

        // Sign the transaction hash using AWS KMS
        const { r, s, v } = await this.signHash(txHash);

        // Ensure r, s, and v are formatted correctly for ethers.js
        const signature = {
            r: '0x' + r, // Ensure r is prefixed with 0x
            s: '0x' + s, // Ensure s is prefixed with 0x
            v
        };

        // Serialize the signed transaction
        const signedTx = ethers.utils.serializeTransaction(transaction, signature);

        // Return the serialized transaction (ready to be broadcast)
        return signedTx;
    }

    async sendTransaction(transaction) {
        // Sign the transaction
        const signedTx = await this.signTransaction(transaction);

        // Send the transaction using the provider
        const txResponse = await this.provider.sendTransaction(signedTx);
        return txResponse;
    }
}

module.exports = KMSWallet;
