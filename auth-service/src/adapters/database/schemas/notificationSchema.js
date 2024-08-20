import mongoose from "mongoose";
import { movieSchema } from "./movieSchema.js";
import { orderSchema } from "./orderSchema.js";

const notificationSchema = new mongoose.Schema({
    reciever_id:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:['SHOW_ALERT','ENROLLMENT_ENDED','BOOKINGS_ENDED','MOVIE_REMINDER']
    },
    orderdata:{
        type:orderSchema
    },
    moviedata:{
        type:movieSchema
    },
    movie_begin:{
        type:Date
    },
    showdata:{
        show_id:{
            type:String
        },
        show_time:{
            type:String
        },
        movie_id:{
            type:String
        },
    },
    screendata:{
        screen_id:{
            type:String
        },
        screen_name:{
            type:String
        },
        movie_id:{
            type:String
        },
    },
    read_status:{
        type:String,
        enum:["READ","UNREAD"],
        default:"UNREAD"
    },
    createdAt:{
        type:Date,
        required:true
    }
})

export default mongoose.model('notification',notificationSchema);