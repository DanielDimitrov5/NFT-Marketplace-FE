import { Buffer } from 'buffer';
import { create } from "ipfs-http-client";

const projectId = process.env.REACT_APP_PROJECT_ID
const projectSecret = process.env.REACT_APP_PROJECT_SECRET;

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

export const infuraIpfsClient = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    apiPath: '/api/v0',
    headers: {
        authorization: auth,
    }
})