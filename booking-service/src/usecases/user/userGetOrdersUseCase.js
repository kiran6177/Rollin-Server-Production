import { AwsConfig } from "../../utils/aws-s3.js";
import { generateQrCode } from "../../utils/generateQrCode.js";
const MOVIE_OWNER = 'movie';

export class UserOrdersGet{
    constructor(dependencies){
        this.orderRepository = new dependencies.Repositories.MongoOrderRepository()
        this.awsConfig = new AwsConfig()
    }

    async execute({page},{id}){
        try {
            console.log("PAG",page);
            let pageTo = page ? page : 1;
            const limit = 20;
            const skip = (pageTo - 1) * limit;
            const ordersData = await this.orderRepository.getOrdersByUserIdWithPage(id,limit,skip);
            const orderResults = []
            for(let order of ordersData){
                let orderObj = order.toObject() 
                const backdrop_path = await this.awsConfig.getImage(orderObj?.movie?.backdrop_path,MOVIE_OWNER)
                const poster_path = await this.awsConfig.getImage(orderObj?.movie?.poster_path,MOVIE_OWNER)
                const qr_url = await generateQrCode(order?.order_id)
                orderResults.push({
                    ...orderObj,
                    movie:{
                        ...orderObj?.movie,
                        backdrop_path,
                        poster_path
                    },
                    qr_url
                })
            }
            // console.log("AFTER",orderResults);
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