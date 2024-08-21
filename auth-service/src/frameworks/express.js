import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'cookie-session'
import { userRouter ,adminRouter, theatreRouter } from '../adapters/routes/index.js';
import { ErrorHandler } from '../adapters/middlewares/error-handler.js';
import { createServer } from 'http'
import cors from 'cors';

export default ()=>{
    const app = express()
    const server = createServer(app)
    app.use(express.urlencoded({extended:true}));
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
        origin:['http://localhost:3000','https://rollin-iota.vercel.app'],
        methods:['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }))
    app.use(session({
        name:'ROLLIN_SESSION',
        keys:[process.env.SESSION_SECRET],
        maxAge: 24* 60 * 60 * 1000
    }))
    app.use('/api/auth/health',
    (req,res)=>{
        console.log("HEALTHY");
     res.json({success:true})})
    app.use('/api/auth/user',userRouter);
    app.use('/api/auth/admin',adminRouter);
    app.use('/api/auth/theatre',theatreRouter);

    app.use(ErrorHandler.handleError)
    return server
}
