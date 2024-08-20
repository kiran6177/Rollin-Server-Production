import mongoose from "mongoose";

const snackStoreSchema = new mongoose.Schema({
    items:[{
        name:{
            type:String
        },
        type:{
            type:String
        },
        stock:{
            type:Number
        },
        description:{
            type:String
        },
        rate:{
            type:Number
        }
    }]
})

export default new mongoose.model('snacks',snackStoreSchema)