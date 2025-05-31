import { createServer } from "./server";
import * as process from "node:process";
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 6001;
const env = process.env.NODE_ENV || "development";
const server = createServer();

const rpcUrl = process.env.RPC_URL;
const privateKey = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;


server.listen(port, () => {
    console.log(`Environment is : ${env}`);
    console.log(`api running on ${port}`);
    console.log(`RPC URL: ${rpcUrl}`);
    console.log(`Private Key: ${privateKey ? '***' : 'not set'}`);
    console.log(`Contract Address: ${contractAddress ? contractAddress : 'not set'}`);
});
