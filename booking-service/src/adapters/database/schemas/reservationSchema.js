import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
    status:{
        type:String,
        enum:['INVALID','AVAILABLE','RESERVED','SOLD']
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    seat_number:{
        type:String,
        required:true
    }
})

const reservationSchema = new mongoose.Schema({
    show_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    showtime:{
        type:String,
        required:true
    },
    screen_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'screen'
    },
    theatre_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'theatre'
    },
    reserved_date:{
        type:Date,
        required:true
    },
    reservations:[{
        type:Object,
        required:true,
        of:[seatSchema]
    }],
    movie_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
})

export default mongoose.model('reservation',reservationSchema)