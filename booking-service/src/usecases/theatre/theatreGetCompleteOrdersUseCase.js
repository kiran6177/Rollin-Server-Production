import { AwsConfig } from "../../utils/aws-s3.js";
import { ObjectId } from "mongodb";

const MOVIE_OWNER = 'movie';

export class TheatreCompleteOrdersGet{
    constructor(dependencies){
        this.orderRepository = new dependencies.Repositories.MongoOrderRepository()
        this.awsConfig = new AwsConfig()
    }

    async execute(filters,{id}){
        try {
            console.log(filters,id);
            const LIMIT = 20;
            let skip = 0;
            if(filters?.page){
                skip = (filters?.page - 1) * LIMIT
            }
            const filterArr = [{theatre_id:new ObjectId(id)}]
            if(filters?.screen_id){
                filterArr.push({'screendata.screen_id':filters?.screen_id})
            }
            if(filters?.show_id && filters?.date){
                const date = new Date(filters?.date)
                filterArr.push({show_id:filters.show_id,show_date:date})
            }
            if(filters?.search){
                console.log("SEAR",filters.search);
                filterArr.push({order_id:{$regex:filters.search,$options:'i'}})
            }
            const orders =  await this.orderRepository.getOrdersByTheatreWithFilters(filterArr,skip,LIMIT)
            const orderResults = []
            for(let order of orders){
                const backdrop_path = await this.awsConfig.getImage(order?.movie?.backdrop_path,MOVIE_OWNER)
                const poster_path = await this.awsConfig.getImage(order?.movie?.poster_path,MOVIE_OWNER)
                orderResults.push({
                    ...order,
                    movie:{
                        ...order?.movie,
                        backdrop_path,
                        poster_path
                    },
                })
            }
            console.log("AFTER",orderResults);
            return orderResults
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}