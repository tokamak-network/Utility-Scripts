# AWS KMS Ethereum Signer

This project provides a way to sign Ethereum transactions using AWS KMS (Key Management Service) without exposing private keys. By using AWS KMS, you can securely manage and store cryptographic keys for signing transactions while interacting with the Ethereum blockchain using the `ethers.js` library.

## Prerequisites

- **Node.js**: Make sure Node.js is installed on your system. You can download it from [Node.js](https://nodejs.org/).
- **AWS KMS Key**: You must have an AWS KMS key for signing. This key will be used to sign Ethereum transactions without exposing the private key.
- **Ethereum Provider**: You need an Ethereum provider URL (e.g., Sepolia Testnet, Infura, Alchemy).

## Setup

### Step 1: Install Dependencies

Run the following command to install the required Node.js dependencies:

```bash
npm install
```


### Step 2: Set Up AWS Credentials

In the main.js file, replace the following placeholders with your AWS credentials:


```
const kms = new AWS.KMS({
    region: 'eu-north-1',  // Replace with your AWS region
    accessKeyId: 'YOUR_ACCESS_KEY',  // Replace with your AWS Access Key
    secretAccessKey: 'YOUR_SECRET_KEY'  // Replace with your AWS Secret Key
});
```
Replace YOUR_ACCESS_KEY and YOUR_SECRET_KEY with your actual AWS credentials, and update the region if needed.


### Step 3: Set Your AWS KMS Key ID

In the main.js file, replace the following placeholder with your KMS Key ID:

```
const keyId = 'YOUR_KMS_KEY_ID';  // Replace with your AWS KMS key ID
```
You can find your KMS Key ID in the AWS KMS Console.


### Step 4: Configure the Ethereum Provider

In the main.js file, you can replace the RPC provider URL to interact with different Ethereum networks. By default, the Sepolia testnet is used:

```
const provider = new ethers.providers.JsonRpcProvider("https://rpc.titan-sepolia.tokamak.network");
If you want to connect to a different network (e.g., Mainnet or another testnet), replace the RPC URL.
```


### Step 5: Running the Script

After setting up the required credentials and configurations, you can run the script as follows:

```
node main.js
```

What the Script Does:

1. Fetches the public key from AWS KMS and computes the corresponding Ethereum address.
2. Builds and signs an Ethereum transaction.
3. Sends the transaction to the Ethereum network.
4. Outputs the transaction response and receipt.


### Expected Output

When the script runs successfully, you should see output similar to the following:

Wallet Address: 0xF26f7E0724a5Ce2b6bDe6551D4327FCb53712d25
```
Transaction Response: {
  nonce: 6,
  gasPrice: BigNumber { _hex: '0x01', _isBigNumber: true },
  gasLimit: BigNumber { _hex: '0x5208', _isBigNumber: true },
  to: '0x08a74A0075a2C3A786A84439812a141C6C8b73f3',
  value: BigNumber { _hex: '0x7b', _isBigNumber: true },
  data: '0x',
  chainId: 55007,
  v: 110049,
  r: '0x8e8b49026ee984f772be79186c53031bbd2e3bdad6cf7020cdca19bd216e9cfc',
  s: '0x40a50079a9e29683d9e05d002ad0a3e68816e26a2ba783b3a122316b18ef2c2c',
  from: '0xF26f7E0724a5Ce2b6bDe6551D4327FCb53712d25',
  hash: '0x44d45c2dae6d4e875d782cbedc1dbf5d7fc49e6b66ef5f1edb31e100545a801d',
  type: null,
  confirmations: 0,
  wait: [Function (anonymous)]
}
Transaction Receipt: {
  to: '0x08a74A0075a2C3A786A84439812a141C6C8b73f3',
  from: '0xF26f7E0724a5Ce2b6bDe6551D4327FCb53712d25',
  contractAddress: null,
  transactionIndex: 0,
  gasUsed: BigNumber { _hex: '0x5208', _isBigNumber: true },
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  blockHash: '0xccc645808d174c11940094dce1517e632697f89a3d07b5c788e185496296e55c',
  transactionHash: '0x44d45c2dae6d4e875d782cbedc1dbf5d7fc49e6b66ef5f1edb31e100545a801d',
  logs: [],
  blockNumber: 6731,
  confirmations: 1,
  cumulativeGasUsed: BigNumber { _hex: '0x5208', _isBigNumber: true },
  status: 1,
  type: 0,
  byzantium: true
}
```


### Notes

1. AWS KMS Permissions: Ensure that your AWS credentials have the necessary permissions to access the KMS key and perform the signing operation.
2. Correct Configuration: Ensure that the region, accessKeyId, secretAccessKey, and keyId fields are configured correctly in the main.js file to ensure successful interaction with AWS KMS.
3. Gas Price and Gas Limit: You may modify the gasPrice and gasLimit parameters in the transaction depending on the network conditions.


### Troubleshooting

1. AWS KMS Permissions: Ensure that the IAM role or user you are using has access to the KMS key for signing.
2. Gas Price: Adjust the gasPrice to a reasonable value to ensure that the transaction gets mined.
3. Network Connection: Ensure that the Ethereum provider URL (e.g., Sepolia or Mainnet) is valid and functioning correctly.