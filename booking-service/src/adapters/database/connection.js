import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

export const connection = ()=>{
    mongoose.connect(process.env.MONGOURL,{enableUtf8Validation:true})
    mongoose.connection.on("connected", () => {
        console.log("Booking Connected to MongoDB");
      })
      
      mongoose.connection.on("error", (err) => {
        console.log("Booking Error connecting to MongoDB");
      })
      
      mongoose.connection.on("disconnected", () => {
        console.log("Booking Disconnected from MongoDB");
      })
}