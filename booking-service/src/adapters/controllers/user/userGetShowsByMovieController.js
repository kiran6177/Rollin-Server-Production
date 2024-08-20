import { AwsConfig } from "../../../utils/aws-s3.js";
const THEATRE_OWNER = 'theatre';

export class UserGetShowByMovie{
    constructor(dependencies){
        this.userGetShowByMovieUseCase = new dependencies.UseCase.UserShowByMovieGet(dependencies)
        this.awsConfig = new AwsConfig()
    }

    async getShowByMovie(req,res,next){
        try {
            const resultData = await this.userGetShowByMovieUseCase.execute(req.body);
            const dataToFrontend = {
                resultData,
            }
            // if(req?.newUserToken){
            //     dataToFrontend.newUserToken = req?.newUserToken
            //     dataToFrontend.newUserData = req?.user
            // }
            res.status(200).json(dataToFrontend)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}