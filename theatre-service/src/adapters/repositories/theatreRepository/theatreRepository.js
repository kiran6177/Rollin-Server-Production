import { TheatreModel } from "../../database/index.js";
import { ObjectId } from 'mongodb'

class TheatreRepository{
    async createTheatre(){
        throw new Error('createTheatre not implemented')
    }
    async findTheatreById(){
        throw new Error('findTheatreById not implemented')
    }
    async findTheatreByIdWithDetails(){
        throw new Error('findTheatreByIdWithDetails not implemented')
    }
    async findTheatreByEmail(){
        throw new Error('findTheatreByEmail not implemented')
    }
    async updateTheatreById(){
        throw new Error('updateTheatreById not implemented')
    }
    async getAllTheatres(){
        throw new Error('getAllTheatres not implemented')
    }
    async getAllTheatresWithLocation(){
        throw new Error('getAllTheatresWithLocation not implemented')
    }
    async getScreenDataById(){
        throw new Error('getScreenDataById not implemented')
    }
    async addScreenToTheatre(){
        throw new Error('addScreenToTheatre not implemented')
    }
    async getTheatreByScreenId(){
        throw new Error('getTheatreByScreenId not implemented')
    }
    async getTheatreByQuery(){
        throw new Error('getTheatreByQuery not implemented')
    }
}

export class MongoTheatreRepository extends TheatreRepository{

    async createTheatre(data){
        try {
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
    async findTheatreByIdWithDetails(id){
        try {
            const data =  await TheatreModel.aggregate([{$match:{_id:new ObjectId(id)}},{$lookup:{from:'screens',localField:'screens',foreignField:'_id',as:'screenData'}}]);
            return data[0]
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
    async getAllTheatres(){
        try {
            return await TheatreModel.find({isVerified:true,isBlocked:false}).lean()
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }

    async getAllTheatresWithLocation(locationArr,distRadius){
        try {
            return await TheatreModel.find({isVerified:true,isBlocked:false,location:{$geoWithin:{$centerSphere:[locationArr,distRadius / 3963.2]}}}).lean()
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }

    async getScreenDataById(id){
        try {
            const screenData = await TheatreModel.aggregate([{$match:{_id:new ObjectId(id)}},{$unwind:'$screens'},{$lookup:{from:'screens',localField:'screens',foreignField:'_id',as:'screenData'}},{$project:{'screenData':1,_id:0}}])
            return screenData.map(screenObj=>screenObj.screenData[0])
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async addScreenToTheatre(theatreid,id){
        try {
            const addscreenData = await TheatreModel.findByIdAndUpdate({_id:theatreid},{$push:{screens:id}},{$new:true})
            return addscreenData
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async getTheatreByScreenId(screen_id){
        try {
            return await TheatreModel.aggregate([{$unwind:'$screens'},{$match:{screens:new ObjectId(screen_id)}}])
        } catch (err) {
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async getTheatreByQuery(query){
        try {
            return await TheatreModel.aggregate([{$match:{name:{$regex:new RegExp(query,'i')}}}])
        } catch (err) {
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
}