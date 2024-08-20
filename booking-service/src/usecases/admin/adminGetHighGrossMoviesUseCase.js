import { AwsConfig } from "../../utils/aws-s3.js";
const MOVIE_OWNER = 'movie';

export class AdminHighGrossMoviesGet{
    constructor(dependencies){
        this.orderRepository = new dependencies.Repositories.MongoOrderRepository()
        this.awsConfig = new AwsConfig()
    }

    async execute(query){
        try {
            console.log("ADMIN");
            const grossOrders = await this.orderRepository.getOrdersGroupedByMovies();
            let resultData = []
            for(let orderObj of grossOrders){
                const poster_path = await this.awsConfig.getImage(orderObj?.movie?.poster_path,MOVIE_OWNER)
                resultData.push({
                    ...orderObj,
                    movie:{
                        ...orderObj?.movie,
                        poster_path
                    }
                })
            }
            console.log(resultData);
            return resultData
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}