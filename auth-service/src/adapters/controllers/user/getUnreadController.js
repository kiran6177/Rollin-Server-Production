import { AwsConfig } from "../../../utils/aws-s3.js";
const USER_OWNER = 'user'

export class UserGetUnread{
    constructor(dependencies){
        this.userUnreadGetUseCase = new dependencies.UseCase.UserUnreadGet(dependencies)
        this.awsConfig = new AwsConfig()
    }
    async getUnread(req,res,next){
        try {
            const resultData = await this.userUnreadGetUseCase.execute(req.query,req?.user);
            const dataToFrontend = {
                resultData,
            }
            if(req?.newUserToken !== null ){
                const image = await this.awsConfig.getImage(req.user?.image,USER_OWNER)
                dataToFrontend.newUserToken = req.newUserToken;
                dataToFrontend.newUserData = {...req.user,image};
            }
            res.status(200).json(dataToFrontend)
        } catch (error) {
            next(error)
        }
    }
}