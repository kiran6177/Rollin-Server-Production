import { ReviewModel } from "../../database/index.js"
import { ObjectId } from "mongodb";

class ReviewRepository{
    async addReview(){
        throw new Error('addReview not implemented')
    }
    async getReviewsByMovieID(){
        throw new Error('getReviewsByMovieID not implemented')
    }
    async getReviewByID(){
        throw new Error('getReviewByID not implemented')
    }
    async getReviewsByMovieIDWithUserByFilters(){
        throw new Error('getReviewsByMovieIDWithUserByFilters not implemented')
    }
    async hitLikeByReviewId(){
        throw new Error('hitLikeByReviewId not implemented')
    }
    async hitDisLikeByReviewId(){
        throw new Error('hitDisLikeByReviewId not implemented')
    }
}

export class MongoReviewRepository extends ReviewRepository{
    async addReview(data){
        try {
            return await ReviewModel.create(data)
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async getReviewsByMovieID(movie_id){
        try {
            return await ReviewModel.find({movie_id})
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async getReviewByID(id){
        try {
            return await ReviewModel.findById({_id:id})
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async getReviewsByMovieIDWithUserByFilters(movie_id,skip,limit){
        try {
            return await ReviewModel.aggregate([{$match:{movie_id:new ObjectId(movie_id)}},{$lookup:{from:'users',localField:'user_id',foreignField:'_id',as:'userdata'}},{$sort:{createdAt:-1}},{$skip:skip},{$limit:limit}])
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async hitLikeByReviewId(review_id,user_id){
        try {
            return await ReviewModel.findByIdAndUpdate({_id:review_id},{$inc:{likes:1},$push:{likedUsers:new ObjectId(user_id)}},{new:true})
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async hitDisLikeByReviewId(review_id,user_id){
        try {
            return await ReviewModel.findByIdAndUpdate({_id:review_id},{$inc:{dislikes:1},$push:{dislikedUsers:new ObjectId(user_id)}},{new:true})
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
}