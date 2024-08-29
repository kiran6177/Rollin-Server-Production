import { OrderModel } from "../../database/index.js";
import { ObjectId } from "mongodb";

class OrderRepository{
    async createOrder(){
        throw new Error('createOrder not implemented')
    }
    async updateOrderById(){
        throw new Error('updateOrderById not implemented')
    }
    async findOrderByOrderId(){
        throw new Error('findOrderByOrderId not implemented')
    }
    async findOrderById(){
        throw new Error('findOrderById not implemented')
    }
    async removeOrderById(){
        throw new Error('removeOrderById not implemented')
    }
    async getOrdersByUserIdWithPage(){
        throw new Error('getOrdersByUserIdWithPage not implemented')
    }
    async getOrdersByTheatreWithFilters(){
        throw new Error('getOrdersByTheatreWithFilters not implemented')
    }
    async getOrdersByTheatreId(){
        throw new Error('getOrdersByTheatreId not implemented')
    }
    async getCollectionByScreenInRange(){
        throw new Error('getCollectionByScreenInRange not implemented')
    }
    async getCollectionByMovie(){
        throw new Error('getCollectionByMovie not implemented')
    }
    async getOrdersGroupedByMovies(){
        throw new Error('getOrdersGroupedByMovies not implemented')
    }
}

export class MongoOrderRepository extends OrderRepository{
    async createOrder(data){
        try {
            return await OrderModel.create(data)
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async updateOrderById(id,data){
        try {
            return await OrderModel.findByIdAndUpdate({_id:id},{$set:data},{new:true})
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async findOrderByOrderId(order_id){
        try {
            return await OrderModel.findOne({order_id}).populate('theatre_id')
            } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async findOrderById(id){
        try {
            return await OrderModel.findById({_id:id})
            } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async removeOrderById(id){
        try {
            return await OrderModel.findByIdAndDelete({_id:id})
            } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async getOrdersByUserIdWithPage(id,limit,skip){
        try {
            return await OrderModel.find({user_id:id}).sort({createdAt:-1}).skip(skip).limit(limit)
            //.populate('theatre_id')
            } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async getOrdersByTheatreWithFilters(filterArr,skip,LIMIT){
        try {
            return await OrderModel.aggregate([{$match:{$and:filterArr}},{$lookup:{from:'users',localField:'user_id',foreignField:'_id',as:'user_data'}},{$sort:{createdAt:-1}},{$skip:skip},{$limit:LIMIT}])
            } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    } 
    async getCollectionByScreenInRange(screen_id,startDate,endDate){
        try {
            return await OrderModel.aggregate([{$match:{'screendata.screen_id':screen_id,refund_id:null,createdAt:{$gte:startDate,$lte:endDate}}},{$group:{_id:null,totalAmount:{$sum:'$billing_amount'}}},{$project:{_id:0,totalAmount:1}}])
            } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    } 
    async getCollectionByMovie(theatre_id,movie_id){
        try {
            return await OrderModel.aggregate([{$match:{theatre_id:new ObjectId(theatre_id),refund_id:null,'movie.movie_id':movie_id}},{$group:{_id:null,totalAmount:{$sum:'$billing_amount'}}},{$project:{_id:0,totalAmount:1}}])
            } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    } 
    async getOrdersByTheatreId(theatre_id,LIMIT){
        try {
            return await OrderModel.aggregate([{$match:{theatre_id:new ObjectId(theatre_id),refund_id:null}},{$sort:{createdAt:-1}},{$limit:LIMIT}])
            } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    } 
    async getOrdersGroupedByMovies(){
        try {
            return await OrderModel.aggregate([
                {$group:{
                    _id:'$movie.movie_id',
                    movie:{$first:'$movie'},
                    amount:{$sum:'$billing_amount'},
                    totalTickets: { $sum: { $reduce: {
                        input: "$seatdata",
                        initialValue: 0,
                        in: { $add: ["$$value", { $size: "$$this.seats" }] }
                      }}}
                }},
                {$sort:{
                    amount:-1
                }}
            ])
            } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    } 
}