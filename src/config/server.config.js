import dbConnect from './database.config.js';
import express from 'express';
import cors from 'cors';

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.db();
        this.middlewares();
    }

    db() {
        dbConnect();

    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        
    }

    routes() {

    }

    listen() {
        this.app.listen(() => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}

export default Server;