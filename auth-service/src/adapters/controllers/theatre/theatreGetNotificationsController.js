import { AwsConfig } from "../../../utils/aws-s3.js";
const THEATRE_OWNER = 'theatre'

export class TheatreGetNotifications{
    constructor(dependencies){
        this.theatreGetNotificationsUseCase = new dependencies.UseCase.TheatreNotificationsGet(dependencies)
        this.awsConfig = new AwsConfig()
    }

    async getNotifications(req,res,next){
        try {           
            const resultData = await this.theatreGetNotificationsUseCase.execute(req.body,req?.theatre)
            
            const dataToFrontend = {
                resultData
            }

            if(req?.newTheatreToken){
                let imagesdata = []
                if(req.theatre?.images && req.theatre?.images.length > 0){
                    for(let image of req.theatre?.images){
                        const url = await this.awsConfig.getImage(image,THEATRE_OWNER)
                        if(url){
                            imagesdata.push({url,filename:image})
                        }
                    }
                }
                req.theatre.images = imagesdata
                dataToFrontend.newTheatreToken = req?.newTheatreToken
                dataToFrontend.newTheatreData = req?.theatre
            }
            res.status(201).json(dataToFrontend)
            
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}