import { AwsConfig } from "../../../utils/aws-s3.js";
const USER_OWNER = 'user'

export class UserEditProfile{
    constructor(dependencies){
        this.userProfileEditUseCase = new dependencies.UseCase.UserProfileEdit(dependencies)
        this.awsConfig = new AwsConfig()
    }
    async editProfile(req,res,next){
        try {
            const resultData = await this.userProfileEditUseCase.execute(req.body,req.user,req.file)

            const dataToFrontend = {resultData}
            if(req?.newUserToken !== null ){
                const image = await this.awsConfig.getImage(req.user?.image,USER_OWNER)
                dataToFrontend.newUserToken = req.newUserToken;
                dataToFrontend.newUserData = {...req.user,image};
            }
            res.status(200).json(dataToFrontend)
        } catch (err) {
            console.log(err.message);
            const error = new Error()
            error.statusCode = 500;
            error.reasons = err.reasons;
            next(error)
        }
    }
}