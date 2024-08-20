import { ReservationModel } from "../../database/index.js";
import { ObjectId } from "mongodb";

class ReservationRespository{
    async addReservationData(){
        throw new Error('addReservationData not implemented')
    }
    async getShowReservations(){
        throw new Error('getShowReservations not implemented')
    }
    async removeShowBookingsBasedOnDate(){
        throw new Error('removeShowBookingsBasedOnDate not implemented')
    }
    async getShowDataByTheatreIdAndDate(){
        throw new Error('getShowDataByTheatreIdAndDate not implemented')
    }
    async getShowDataByMovieIdAndDate(){
        throw new Error('getShowDataByMovieIdAndDate not implemented')
    }
    async getSingleShowDataByIdandDate(){
        throw new Error('getSingleShowDataByIdandDate not implemented')
    }
    async findShowByShowIdandDate(){
        throw new Error('findShowByShowIdandDate not implemented')
    }
    async updateReservationsById(){
        throw new Error('updateReservationsById not implemented')
    }
    async getShowsByTheatreIdAndScreenId(){
        throw new Error('getShowsByTheatreIdAndScreenId not implemented')
    }
}

export class MongoReservationRepository extends ReservationRespository{
    async addReservationData(data){
        try {
            return await ReservationModel.create(data)
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async getShowReservations(showtime,show_id,date){
        try {
            return await ReservationModel.aggregate([{$match:{$and:[{showtime},{show_id:new ObjectId(show_id)},{reserved_date:{$gte:date}}]}}])
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async removeShowBookingsBasedOnDate(show_id,date){
        try {
            return await ReservationModel.findOneAndDelete({show_id,reserved_date:date})
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async getShowDataByTheatreIdAndDate(theatre_id,date){
        try {
            return await ReservationModel.aggregate([{$match:{$and:[{theatre_id:new ObjectId(theatre_id)},{reserved_date:new Date(date)}]}},{$lookup:{from:'screens',localField:'screen_id',foreignField:'_id',as:'screenData'}},{$group:{_id:'$movie_id',shows:{$push:'$$ROOT'}}}])
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async getShowDataByMovieIdAndDate(movie_id,date){
        try {
            return await ReservationModel.aggregate([{$match:{$and:[{movie_id:new ObjectId(movie_id)},{reserved_date:new Date(date)}]}},{$lookup:{from:'screens',localField:'screen_id',foreignField:'_id',as:'screenData'}},{$lookup:{from:'theatres',localField:'theatre_id',foreignField:'_id',as:'theatreData'}},{$group:{_id:'$theatre_id',shows:{$push:'$$ROOT'}}}])
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async getSingleShowDataByIdandDate(show_id,date){
        try {
            return await ReservationModel.aggregate([{$match:{$and:[{show_id:new ObjectId(show_id)},{reserved_date:new Date(date)}]}},{$lookup:{from:'screens',localField:'screen_id',foreignField:'_id',as:'screenData'}},{$group:{_id:'$movie_id',shows:{$push:'$$ROOT'}}}])
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async findShowByShowIdandDate(show_id,date){
        try {
            return await ReservationModel.findOne({show_id,reserved_date:date})
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async updateReservationsById(id,data){
        try {
            return await ReservationModel.findByIdAndUpdate({_id:id},{$set:{reservations:data}},{new:true})
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async getShowsByTheatreIdAndScreenId(id,screen_id,date,limit,skip){
        try {
            return await ReservationModel.aggregate([{$match:{$and:[{screen_id:new ObjectId(screen_id)},{theatre_id:new ObjectId(id)},{reserved_date:{$gte:date}}]}},{$sort:{reserved_date:1,_id:1}},{$skip:skip},{$limit:limit},{$lookup:{from:'screens',localField:'screen_id',foreignField:'_id',as:'screenData'}}])
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
}