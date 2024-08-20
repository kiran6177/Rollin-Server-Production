import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

const JWT_AUTHSECRET = process.env.JWT_AUTHSECRET;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_SECRET;

export const createToken = (data)=>{
    // console.log(JWT_AUTHSECRET);
    return jwt.sign(data,JWT_AUTHSECRET,{expiresIn:'15m'})
} 

export const createRefreshToken = (data)=>{
    // console.log(JWT_REFRESH_TOKEN);
    return jwt.sign(data,JWT_REFRESH_TOKEN,{expiresIn:'30d'});
}

export const verifyAccessToken = (token)=>{
    return jwt.verify(token,JWT_AUTHSECRET,(err,decoded)=>{
        if(err){
            return false
        }
        return decoded
        
    })
}

export const verifyRefreshToken = (token)=>{
    return jwt.verify(token,JWT_REFRESH_TOKEN,(err,decoded)=>{
        if(err){
            return false
        }
        return decoded
        
    })
}