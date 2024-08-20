import { AwsConfig } from "../../../utils/aws-s3.js";
const THEATRE_OWNER = 'theatre'

export class TheatreUpdateProfile{
    constructor(dependencies){
        this.theatreProfileUpdateUseCase = new dependencies.UseCase.TheatreProfileUpdate(dependencies)
        this.awsConfig = new AwsConfig()
    }

    async updateProfile(req,res,next){
        try {           
            const profileUpdateData = await this.theatreProfileUpdateUseCase.execute(req.body.data,req.files)
            console.log("UPDATEEED",profileUpdateData);
            if(!profileUpdateData.isVerified){
                res.cookie('theatreRefreshToken',null,{httpOnly:true,secure:true,maxAge:0})
                res.status(201).json({success:false})
            }else{
                const dataToFrontend = {
                    success:true,
                    theatreData:profileUpdateData
                }

                    if(req?.newTheatreToken){
                        let imagesdata = []
                        if(req.theatre?.images && req.theatre?.images.length > 0){
                            for(let image of req.theatre?.images){
                                const url = await this.awsConfig.getImage(image,THEATRE_OWNER)
                                if(url){
                                    imagesdata.push({url,filename:image})
                                }else{
                                    // write image fetch error code
                                }
                            }
                        }else{
                            // no image added 
                        } 
                        req.theatre.images = imagesdata
                        dataToFrontend.newTheatreToken = req?.newTheatreToken
                        dataToFrontend.newTheatreData = req?.theatre
                    }
                res.status(201).json(dataToFrontend)
            }
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}