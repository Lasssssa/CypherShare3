import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
    // Check for required environment variables
    if (!process.env.PRIVATE_KEY) {
        throw new Error('Please set your PRIVATE_KEY in the .env file');
    }
    if (!process.env.RPC_URL) {
        throw new Error('Please set your RPC_URL in the .env file');
    }

    // Connect to the network
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log('Deploying contracts with the account:', wallet.address);
    
    // Get balance using provider instead of wallet
    const balance = await provider.getBalance(wallet.address);
    console.log('Account balance:', ethers.formatEther(balance), 'ETH');

    // Read the contract source
    const contractPath = path.join(__dirname, '../..', 'contracts', 'FileAccessControl.sol');
    const source = fs.readFileSync(contractPath, 'utf8');

    // Compile the contract
    const solc = require('solc');
    const input = {
        language: 'Solidity',
        sources: {
            'FileAccessControl.sol': {
                content: source,
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*'],
                },
            },
        },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    if (output.errors) {
        console.error('Compilation errors:', output.errors);
        throw new Error('Contract compilation failed');
    }

    const contract = output.contracts['FileAccessControl.sol']['FileAccessControl'];
    const bytecode = contract.evm.bytecode.object;
    const abi = contract.abi;

    // Deploy the contract
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    console.log('Deploying FileAccessControl contract...');
    
    const contractDeploy = await factory.deploy();
    await contractDeploy.waitForDeployment();

    const deployedAddress = await contractDeploy.getAddress();
    console.log('FileAccessControl deployed to:', deployedAddress);

    // Save the deployment information
    const deploymentInfo = {
        contractAddress: deployedAddress,
        network: process.env.RPC_URL,
        deployer: wallet.address,
        timestamp: new Date().toISOString(),
    };

    fs.writeFileSync(
        path.join(__dirname, '..', 'deployment-info.json'),
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log('Deployment information saved to deployment-info.json');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 