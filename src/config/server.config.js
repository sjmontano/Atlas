import dbConnect from './database.config.js';
import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import uploadsRouter from '../routes/uploads.route.js';
import modalInfoRouter from '../routes/modalInfo.route.js';
import locationRouter from '../routes/location.routes.js';

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.db();
        this.middlewares();
        this.routes();
    }

    db() {
        dbConnect();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json({ limit: '5mb' }));
        this.app.use(express.urlencoded({ limit: '5mb', extended: true }));
        this.app.use(
            fileUpload({
                useTempFiles: true,
                tempFileDir: '/tmp/'
            })
        );
    }

    routes() {
        this.app.use('/api/v1/uploads', uploadsRouter);
        this.app.use('/api/v1/modal', modalInfoRouter);
        this.app.use('/api/v1/location', locationRouter);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}

export default Server;