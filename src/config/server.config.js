import express from 'express';


class Server {
    
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
    }

    db(){

    }

    middlewares(){
        this.app.use( cors() );
    }

    routes(){

    }

    listen(){
        this.app.listen(() => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}

export default Server;