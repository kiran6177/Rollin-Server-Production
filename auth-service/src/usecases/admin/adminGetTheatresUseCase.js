import { AwsConfig } from "../../utils/aws-s3.js";
const THEATRE_OWNER = 'theatre'

export class GetTheatres{
    constructor(dependencies){
        this.adminRepository = new dependencies.Repositories.MongoAdminRepository();
        this.awsConfig = new AwsConfig()
    }

    async execute(){
        try {
            const theatres = await this.adminRepository.getAllTheatres();
            console.log(theatres);
            let theatresWOP = [];
             for(let theatre of theatres){
                let imagesURL = []
                if(theatre.images && theatre.images.length > 0){
                    for(let image of theatre.images){
                        const url = await this.awsConfig.getImage(image,THEATRE_OWNER)
                        if(url){
                            imagesURL.push(url)
                        }else{
                            // write image fetch error code
                        }
                    }
                }else{
                    // no image added 
                }   
                theatresWOP.push({
                    id:theatre._id,
                    name:theatre.name,
                    email:theatre.email,
                    images:imagesURL,
                    isVerified:theatre.isVerified,
                    isCompleted:theatre.isCompleted,
                    isAccepted:theatre.isAccepted,
                    isBlocked:theatre.isBlocked,
                    address:theatre.address ? theatre.address : null,
                    location:theatre.location ? theatre.location : null
                })
            }
            return theatresWOP
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}