import { AwsConfig } from "../../../utils/aws-s3.js";
const THEATRE_OWNER = 'theatre';

export class TheatreGetScreenCollection{
    constructor(dependencies){
        this.theatreGetScreenCollectionUseCase = new dependencies.UseCase.TheatreScreenCollectionGet(dependencies)
        this.awsConfig = new AwsConfig()
    }

    async getScreenCollection(req,res,next){
        try {
            const resultData = await this.theatreGetScreenCollectionUseCase.execute(req.body,req?.theatre);
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