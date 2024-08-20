import { AwsConfig } from '../../utils/aws-s3.js'
const THEATRE_OWNER = 'theatre'

export class UserSingleTheatreGet{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.awsConfig = new AwsConfig()
    }

    async execute({theatre_id}){
        try {
            console.log(theatre_id);
            if(theatre_id){
                let theatreList = await this.theatreRepository.findTheatreByIdWithDetails(theatre_id);
                // console.log("THHHHHHHHH",theatreList);
                if(theatreList){
                    let theatreData;
                    
                    let imageUrls = []
                    for(let image of theatreList.images){
                        let url = await this.awsConfig.getImage(image,THEATRE_OWNER)
                        imageUrls.push(url)
                    }

                    theatreData = {
                        ...theatreList,
                        images:imageUrls
                    }
                
                    console.log("daT",theatreData);
                    return theatreData
                }else{
                    const error = new Error()
                    error.statusCode = 400
                    error.reasons = ['Theatre Not Found!!']
                    throw error;
                }
            }else{
                const error = new Error()
                error.statusCode = 400
                error.reasons = ['Invalid Theatre!!']
                throw error;
            }
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
