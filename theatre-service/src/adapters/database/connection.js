import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

export const connection = ()=>{
    mongoose.connect(process.env.MONGOURL)
    mongoose.connection.on("connected", () => {
        console.log("Theatre Connected to MongoDB");
      })
      
      mongoose.connection.on("error", (err) => {
        console.log("Theatre Error connecting to MongoDB");
      })
      
      mongoose.connection.on("disconnected", () => {
        console.log("Theatre Disconnected from MongoDB");
      })
}