import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
    movie:{
        type:String,
        required:true
    },
    users:[{
        type:String
    }]
})

export default mongoose.model('reminder',reminderSchema);