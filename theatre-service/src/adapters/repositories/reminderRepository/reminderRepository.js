import { ReminderModel } from "../../database/index.js";

class ReminderRepository{
    async addReminder(){
        throw new Error('addReminder not implemented')
    }
    async findReminderByMovieId(){
        throw new Error('findReminderByMovieId not implemented')
    }
    async addUsersByMovieID(){
        throw new Error('addUsersByMovieID not implemented')
    }
    async removeReminderById(){
        throw new Error('removeReminderById not implemented')
    }
}

export class MongoReminderRepository extends ReminderRepository{
    async addReminder(data){
        try {
            return await ReminderModel.create(data)
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async findReminderByMovieId(movie_id){
        try {
            return await ReminderModel.findOne({movie:movie_id})
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async addUsersByMovieID(movie_id,user_id){
        try {
            return await ReminderModel.findOneAndUpdate({movie:movie_id},{$push:{users:user_id}},{new:true})
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async removeReminderById(id){
        try {
            return await ReminderModel.findByIdAndDelete({_id:id})
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
}