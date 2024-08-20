import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    mobile:{
        type:Number,
        required:true
    },
})

export default mongoose.model('admin',adminSchema);