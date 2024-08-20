import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
    person_id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    biography:{
        type:String,
        default:'UNAVAILABLE'
    },
    birthday:{
        type:Date,
        default:null
    },
    gender:{
        type:String,
        default:'UNAVAILABLE'
    },
    department:{
        type:String,
        default:'UNAVAILABLE'
    },
    birth_place:{
        type:String,
        default:'UNAVAILABLE'
    },
    profile_path:{
        type:String,
        default:null
    }
})

export default mongoose.model('people',personSchema)