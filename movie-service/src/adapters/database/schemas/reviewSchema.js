import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    movie_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'movie',
        required:true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    hashtags:[{
        type:String
    }],
    content:{
        type:String,
        required:true
    },
    likes:{
        type:Number,
        default:0
    },
    likedUsers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    }],
    dislikes:{
        type:Number,
        default:0
    },
    dislikedUsers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    }],
    rating:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:new Date()
    }
})

export default mongoose.model('review',reviewSchema)