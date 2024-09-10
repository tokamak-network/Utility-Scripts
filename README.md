# Utility Scripts Repository

Welcome to the **Utility-Scripts** repository! This repository contains various utility scripts that developers can use for different tasks, such as cryptographic operations, blockchain interactions, and general development utilities.

Each script is stored in its own folder, containing the script itself and any necessary documentation or dependencies.

## Repository Structure

- Each script is contained in its own folder.
- A `README.md` file is provided in each folder, detailing how to use the script.
- Small projects with utility scripts can be browsed by exploring the different folders.

## How to Use the Repository

1. **Browse** the repository and look for a folder that contains a script you are interested in.
2. **Navigate** to the script’s folder.
3. Each folder contains:
   - The script file(s) themselves.
   - A `README.md` file explaining what the script does and how to use it.

For example:
- [aws-kms-signing/](aws-kms-signing/): Contains a custom AWS KMS class implementation for signing messages without using a third-party library.
- [ethersjs-gas-management/](ethersjs-gas-management/): Contains a script to manage gas prices using Ethers.js.

## Adding New Scripts/Programs

To add a new script:
1. Create a new folder in the repository with a descriptive name.
2. Add your script(s) to that folder.
3. Create a `README.md` file within the folder to document how to use your script.

## Example Script Folders

### 1. AWS KMS Signing Script

Folder: [aws-kms-signing/](aws-kms-signing/)

This folder contains a script for signing messages using AWS KMS. It's designed for secure message signing without exposing private keys.

```bash
cd aws-kms-signing
node aws_kms_signing.js