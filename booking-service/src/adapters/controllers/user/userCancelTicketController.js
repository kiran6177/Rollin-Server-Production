import { AwsConfig } from "../../../utils/aws-s3.js";
const USER_OWNER = 'user'

export class UserCancelTicket{
    constructor(dependencies){
        this.userCancelTicketUseCase = new dependencies.UseCase.UserTicketCancel(dependencies)
        this.awsConfig = new AwsConfig()
    }

    async cancelTicket(req,res,next){
        try {
            const resultData = await this.userCancelTicketUseCase.execute(req.body,req?.user);
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
            console.log(error);
            next(error)
        }
    }
}