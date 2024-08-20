import { AwsConfig } from "../../../utils/aws-s3.js";
const USER_OWNER = 'user'

export class UserGetOrders{
    constructor(dependencies){
        this.userGetOrdersUseCase = new dependencies.UseCase.UserOrdersGet(dependencies)
        this.awsConfig = new AwsConfig()
    }

    async getOrders(req,res,next){
        try {
            const resultData = await this.userGetOrdersUseCase.execute(req.body,req?.user);
            const dataToFrontend = {
                resultData,
            }
            if(req?.newUserToken){
                const image = await this.awsConfig.getImage(req.user?.image,USER_OWNER)
                dataToFrontend.newUserToken = req.newUserToken;
                dataToFrontend.newUserData = {...req.user,image};
            }
            res.status(200).json(dataToFrontend)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}