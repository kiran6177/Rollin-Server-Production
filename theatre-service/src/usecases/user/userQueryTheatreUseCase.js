import { AwsConfig } from '../../utils/aws-s3.js'
const THEATRE_OWNER = 'theatre'

export class UserQueryTheatre{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.awsConfig = new AwsConfig()
    }

    async execute({search}){
        try {
            const theatres = await this.theatreRepository.getTheatreByQuery(search)
            return theatres
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}