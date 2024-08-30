import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

const MONGOURL = process.env.MONGOURL
export const connection = ()=>{
  
    mongoose.connect(MONGOURL,{enableUtf8Validation:true})
    mongoose.connection.on("connected", () => {
        console.log("Auth Connected to MongoDB");
      })
      
      mongoose.connection.on("error", (err) => {
        console.log("Auth Error connecting to MongoDB");
      })
      
      mongoose.connection.on("disconnected", () => {
        console.log("Auth Disconnected from MongoDB");
      })
}