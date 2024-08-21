import express from 'express';
import cookieParser from 'cookie-parser';
import { ErrorHandler } from '../adapters/middlewares/error-handler.js';
import { theatreRouter } from '../adapters/routes/index.js'
import cors from 'cors';

export default ()=>{
    const app = express()
    app.use(express.urlencoded({extended:true}));
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
        origin:['http://localhost:3000','https://rollin-iota.vercel.app'],
        methods:['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }))

    app.use('/api/theatre',theatreRouter);

    app.use(ErrorHandler.handleError)
    return app
}
