import express from 'express';
import cookieParser from 'cookie-parser';
import { ErrorHandler } from '../adapters/middlewares/error-handler.js';
import { theatreRouter } from '../adapters/routes/index.js'

export default ()=>{
    const app = express()
    app.use(express.urlencoded({extended:true}));
    app.use(express.json());
    app.use(cookieParser());
    

    app.use('/theatre',theatreRouter);

    app.use(ErrorHandler.handleError)
    return app
}
