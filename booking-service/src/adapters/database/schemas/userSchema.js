import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    street:{
        type:String,
        required:true,
        default:null
    },
    landmark:{
        type:String,
        required:true,
        default:null
    },
    city:{
        type:String,
        required:true,
        default:null,
    },
    state:{
        type:String,
        required:true,
        default:null,
    },
    pincode:{
        type:Number,
        required:true,
        default:null
    }
})

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    mobile:{
        type:Number,
        required:true
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        default:""
    },
    image:{
        type:String,
    },
    address:{
        type:addressSchema
    },
    walletBalance:{
        type:Number,
        default:0
    },
    isVerified:{
        type:Boolean,
        required:true,
    },
    type:{
        type:String,
        enum:['GOOGLE-AUTH','MOBILE-AUTH','EMAIL-AUTH'],
        required:true
    },
})

export default mongoose.model('user',userSchema)