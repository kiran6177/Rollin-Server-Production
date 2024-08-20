import server from './app.js';
import dotenv from 'dotenv'

dotenv.config();


const PORT = process.env.PORT

const startServer = ()=>{
    server.listen(PORT,()=>{
        console.log("Auth Listening on ",PORT);
    })
}

startServer() 