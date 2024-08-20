import { AwsConfig } from "../../../utils/aws-s3.js";
const THEATRE_OWNER = 'theatre';

export class TheatreRemoveMovie{
    constructor(dependencies){
        this.theatreRemoveMovieUseCase = new dependencies.UseCase.TheatreMovieRemove(dependencies)
        this.awsConfig = new AwsConfig()
    }

    async removeMovie(req,res,next){
        try {
            const resultData = await this.theatreRemoveMovieUseCase.execute(req.body);
            const dataToFrontend = {
                resultData,
            }
            if(req?.newTheatreToken){
                let images =  []
                if(req.theatre && req.theatre.images && req.theatre.images.length > 0){
                    for(let image of req.theatre.images){
                        const url = await this.awsConfig.getImage(image,THEATRE_OWNER)
                        images.push({filename:image,url})
                    }
                }
                dataToFrontend.newTheatreToken = req?.newTheatreToken
                dataToFrontend.newTheatreData = {...req?.theatre,images}
            }
            res.status(200).json(dataToFrontend)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}