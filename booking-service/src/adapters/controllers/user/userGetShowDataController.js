import { AwsConfig } from "../../../utils/aws-s3.js";
const THEATRE_OWNER = 'theatre';

export class UserGetShowData{
    constructor(dependencies){
        this.userGetShowDataUseCase = new dependencies.UseCase.UserShowDataGet(dependencies)
        this.awsConfig = new AwsConfig()
    }

    async getShowData(req,res,next){
        try {
            const resultData = await this.userGetShowDataUseCase.execute(req.body);
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