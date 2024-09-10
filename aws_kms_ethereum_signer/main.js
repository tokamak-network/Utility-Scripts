const AWS = require('aws-sdk');
const KMSWallet = require('./KMSWallet');
const { ethers } = require('ethers'); 

// Initialize the AWS KMS client
const kms = new AWS.KMS({
    region: 'eu-north-1', // replace with your region
    accessKeyId: '',  // replace with your access key
    secretAccessKey: ''  // replace with your secret key
});

// Replace with your keyId
const keyId = '';

// Setup the JsonRpcProvider for desired Chain (ethers.js v5)
const provider = new ethers.providers.JsonRpcProvider("https://rpc.titan-sepolia.tokamak.network");

async function main() {
    const wallet = new KMSWallet(kms, keyId, provider);

    // Get the Ethereum address derived from the KMS public key
    const address = await wallet.getPublicKey();
    console.log(`Wallet Address: ${address}`);

    // Get the current nonce for the account
    const nonce = await provider.getTransactionCount(address);

    // Build the transaction
    const transaction = {
        nonce: ethers.utils.hexlify(nonce),  // Fetch the nonce from the network and convert to hex
        // gasPrice: ethers.utils.hexlify(ethers.utils.parseUnits('2', 'gwei')),  // Convert 20 Gwei to hex
        gasPrice: 1, // set the gas price for the transaction 
        gasLimit: 21000,  // Convert gasLimit to hex
        to: '0x08a74A0075a2C3A786A84439812a141C6C8b73f3',  // The recipient address
        value: 123,  // 
        chainId: 55007,  // chain ID
    };

    // Send the signed transaction
    const txResponse = await wallet.sendTransaction(transaction);
    console.log("Transaction Response:", txResponse);

    // Wait for the transaction to be mined
    const receipt = await provider.waitForTransaction(txResponse.hash);
    console.log("Transaction Receipt:", receipt);
}

main().catch(console.error);
