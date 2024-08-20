import { TheatreModel } from "../../database/index.js";
import { ObjectId } from 'mongodb'


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
    async addMovieToTheatre(){
        throw new Error('addMovieToTheatre not implemented')
    }
    async removeMovieFromTheatre(){
        throw new Error('removeMovieFromTheatre not implemented')
    }
    async findMoviesFromTheatreByLocation(){
        throw new Error('findMoviesFromTheatreByLocation not implemented')
    }
    async findEnrolledMoviesByMovieId(){
        throw new Error('findEnrolledMoviesByMovieId not implemented')
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
    async addMovieToTheatre(theatre_id,movie_id){
        try {
            return await TheatreModel.findByIdAndUpdate({_id:theatre_id},{$push:{enrolledMovies:new ObjectId(movie_id)}},{new:true}) 
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async removeMovieFromTheatre(theatre_id,movie_id){
        try {
            return await TheatreModel.findByIdAndUpdate({_id:theatre_id},{$pull:{enrolledMovies:new ObjectId(movie_id)}},{new:true}) 
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async findMoviesFromTheatreByLocation(locationArr,distRadius){
        try {
            console.log(locationArr,distRadius)
            return await TheatreModel.find({location:{$geoWithin:{$centerSphere:[locationArr,distRadius / 3963.2]}}}) 
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async findEnrolledMoviesByMovieId(movie_id){
        try {
            const outputData = await TheatreModel.aggregate([{$unwind:'$enrolledMovies'},{$group:{_id:null,enrolledMovies:{$addToSet:'$enrolledMovies'}}},{$project:{enrolledMovies:1,_id:0}}])
            return outputData[0]?.enrolledMovies || []
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
}