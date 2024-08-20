import { AwsConfig } from '../../utils/aws-s3.js'
const THEATRE_OWNER = 'theatre'

export class UserTheatresGet{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.awsConfig = new AwsConfig()
    }

    async execute({location}){
        try {
            let theatreList;
            if(location?.lat &&  location?.lng){
                console.log("TT",location);
                theatreList = await this.theatreRepository.getAllTheatresWithLocation([location?.lat,location?.lng],100)
            }else{
                console.log("TT");
                theatreList = await this.theatreRepository.getAllTheatres()
            }
            // console.log(theatreList);
            const theatreData  = []
            for(let theatre of theatreList){
                let imageUrls = []
                for(let image of theatre.images){
                    let url = await this.awsConfig.getImage(image,THEATRE_OWNER)
                    imageUrls.push(url)
                }
                theatreData.push({
                    ...theatre,
                    images:imageUrls
                })
            }
            // console.log(theatreData);
            return theatreData
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
