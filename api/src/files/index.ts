import {createRouter} from "../utils/create-router";
import { ethers } from "ethers";
import contractJson from '../../artifacts/contracts/FileAccessControl.sol/FileAccessControl.json';

const filesRouter = createRouter();

filesRouter.post('/upload-file', async function (req, res, next) {
    try {
        const { cid, name, size, cryptedKeys, recipients } = req.body;

        // Validate required fields
        if (!cid || !name || !size || !cryptedKeys || !recipients) {
            console.log('Missing required fields:', { cid, name, size, cryptedKeys, recipients });
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate array lengths match
        if (cryptedKeys.length !== recipients.length) {
            console.log('Array length mismatch:', { cryptedKeysLength: cryptedKeys.length, recipientsLength: recipients.length });
            return res.status(400).json({ error: 'cryptedKeys and recipients arrays must have the same length' });
        }

        // Validate addresses
        for (const recipient of recipients) {
            if (!ethers.isAddress(recipient)) {
                console.log('Invalid address:', recipient);
                return res.status(400).json({ error: `Invalid address: ${recipient}` });
            }
        }

        // Get contract instance (you'll need to implement this based on your setup)
        const contract = await getFileAccessControlContract();
        
        console.log('Uploading file with params:', {
            cid,
            name,
            size: size.toString(),
            cryptedKeys,
            recipients
        });

        // Call the smart contract
        const tx = await contract.uploadFile(
            cid,
            name,
            size,
            cryptedKeys,
            recipients
        );

        console.log('Transaction sent:', tx.hash);
        
        // Wait for transaction confirmation
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);

        // Find the FileUploaded event - Updated event finding logic
        const event = receipt.logs.find(
            (log: any) => {
                try {
                    // Try to decode the log
                    const parsedLog = contract.interface.parseLog({
                        topics: log.topics,
                        data: log.data
                    });
                    return parsedLog?.name === 'FileUploaded';
                } catch (e) {
                    return false;
                }
            }
        );
        console.log(receipt);

        if (!event) {
            console.log('Available logs:', receipt.logs); // Add this for debugging
            throw new Error('FileUploaded event not found in transaction receipt');
        }

        // Parse the event data
        const parsedEvent = contract.interface.parseLog({
            topics: event.topics,
            data: event.data
        });

        const fileId = parsedEvent?.args[0];
        console.log('File uploaded successfully with ID:', fileId.toString());

        res.json({
            success: true,
            fileId: fileId.toString(),
            transactionHash: tx.hash
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

filesRouter.get('/get-my-uploaded-files', async function (req, res, next) {
    try {
        const { address } = req.query; // Get user's address from query parameters

        // Validate the address
        if (!address || !ethers.isAddress(address as string)) {
            console.log('Invalid or missing address:', address);
            return res.status(400).json({ error: 'Invalid or missing address' });
        }

        // Get contract instance
        const contract = await getFileAccessControlContract();
        
        console.log('Fetching uploaded files for address:', address);

        // Get the array of file IDs owned by the user using the new function
        const fileIds = await contract.getFilesByOwner(address);
        console.log('File IDs found:', fileIds);

        // Get metadata for each file
        const files = await Promise.all(
            fileIds.map(async (fileId: bigint) => {
                try {
                    const [owner, cid, name, size, timestamp] = await contract.getFileMetadata(fileId);
                    return {
                        fileId: fileId.toString(),
                        owner,
                        cid,
                        name,
                        size: size.toString(),
                        uploadDate: new Date(Number(timestamp) * 1000).toISOString(),
                        isActive: true // Since these are files owned by the user, they are always active
                    };
                } catch (error) {
                    console.error(`Error fetching metadata for file ${fileId}:`, error);
                    return null;
                }
            })
        );

        // Filter out any null values (files that couldn't be fetched)
        const validFiles = files.filter((file): file is NonNullable<typeof file> => file !== null);

        console.log('Formatted files:', validFiles);

        res.json({
            success: true,
            files: validFiles
        });

    } catch (error) {
        console.error('Error fetching uploaded files:', error);
        res.status(500).json({ error: 'Failed to fetch uploaded files' });
    }
});

filesRouter.get('/get-my-shared-files', async function (req, res, next) {
    try {
        const { address } = req.query; // Get user's address from query parameters

        // Validate the address
        if (!address || !ethers.isAddress(address as string)) {
            console.log('Invalid or missing address:', address);
            return res.status(400).json({ error: 'Invalid or missing address' });
        }

        // Get contract instance
        const contract = await getFileAccessControlContract();
        
        console.log('Fetching files for address:', address);

        // Call the smart contract to get the files for the specific address
        const files = await contract.getFilesSharedWithUser(address);

        console.log('Files fetched:', files);

        const formattedFiles = files.map((file: any) => ({
            fileId: file[0].toString(),
            owner: file[1],
            cid: file[2],
            name: file[3],
            size: file[4].toString(),
            timestamp: file[5].toString(),
            cryptedKey: file[6],
        }));

        console.log('Formatted files:', formattedFiles);

        res.json({
            success: true,
            files: formattedFiles
        });

    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
});

// Helper function to get contract instance (implement based on your setup)
async function getFileAccessControlContract() {
  const rpcUrl = process.env.RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!rpcUrl || !privateKey || !contractAddress) {
    throw new Error('Missing environment variables: RPC_URL, PRIVATE_KEY, or CONTRACT_ADDRESS');
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(
    contractAddress,
    contractJson.abi,
    wallet
  );

  return contract;
}

export default filesRouter;