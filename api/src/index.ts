import { createServer } from "./server";
import * as process from "node:process";
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 6001;
const env = process.env.NODE_ENV || "development";
const server = createServer();

server.listen(port, () => {
    console.log(`Environment is : ${env}`);
    console.log(`api running on ${port}`);
});
