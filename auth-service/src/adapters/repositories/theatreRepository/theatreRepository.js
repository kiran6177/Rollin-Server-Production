import { TheatreModel } from "../../database/index.js";

class TheatreRepository{
    async createTheatre(){
        throw new Error('createTheatre not implemented')
    }
    async findTheatreById(){
        throw new Error('findTheatreById not implemented')
    }
    async findTheatreByEmail(){
        throw new Error('findTheatreByEmail not implemented')
    }
    async updateTheatreById(){
        throw new Error('updateTheatreById not implemented')
    }
    async googleLogin(){
        throw new Error('googleLogin not implemented')
    }
    async getTheatresCountByDate(){
        throw new Error('getTheatresCountByDate not implemented')
    }
}

export class MongoTheatreRepository extends TheatreRepository{

    async createTheatre(data){
        try {
            data.createdAt = new Date()
            const theatre = new TheatreModel(data)
            return await theatre.save();
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async findTheatreById(id){
        try {
            return await TheatreModel.findById({_id:id});
        } catch (err) {
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async findTheatreByEmail(email){
        try {
            return await TheatreModel.findOne({email})
        } catch (err) {
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async updateTheatreById(id,data){
        try {
            return await TheatreModel.findByIdAndUpdate({_id:id},{$set:data},{new:true}) 
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async getTheatresCountByDate(startDate,endDate){
        try {
            return await TheatreModel.aggregate([{$match:{createdAt:{$gte:startDate,$lte:endDate}}},{$count:'totalCount'}]) 
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
}