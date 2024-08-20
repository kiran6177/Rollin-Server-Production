import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    type:{
        type:String,
        enum:['Point'],
        default:'Point'
    },
    coordinates : {
        type: Array,
        required :true
    }
})

const addressSchema = new mongoose.Schema({
    completeLocation:{
        type:String,
        required:true
    },
    street:{
        type:String,
        required:true
    },
    landmark:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
})

const theatreSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    images:{
        type:Array,
    },
    location:{
        type:locationSchema
    },
    address:{
        type:addressSchema
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
    authType:{
        type:String,
        enum:['GOOGLE_AUTH','EMAIL_AUTH'],
        default:'EMAIL_AUTH'
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAccepted:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    enrolledMovies:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'movie'
    }]
})

theatreSchema.index({location:"2dsphere"});

export default mongoose.model('theatre',theatreSchema);