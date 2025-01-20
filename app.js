import Server from './src/config/server.config.js';
import dotenv from 'dotenv';
dotenv.config();

const server = new Server();
server.listen();