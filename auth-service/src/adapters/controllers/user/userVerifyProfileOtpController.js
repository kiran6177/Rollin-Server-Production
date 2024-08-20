import { AwsConfig } from "../../../utils/aws-s3.js";
const USER_OWNER = 'user'

export class UserVerifyProfileOtp{
    constructor(dependencies){
        this.userVerifyProfileOtpUseCase = new dependencies.UseCase.VerifyProfileOtp(dependencies)
        this.awsConfig = new AwsConfig()
    }

    async verifyProfileOtp(req,res,next){
        try {
            console.log(req.session);
            const resultData = await this.userVerifyProfileOtpUseCase.execute(req.body,req.session,req.user)
            const dataToFrontend = {
                resultData
            }
            if(resultData){
                req.session.userEmailOtp = null;
                req.session.userOtpTime = null;
                req.session.updatedUserData = null;
            }
            if(req?.newUserToken !== null ){
                const image = await this.awsConfig.getImage(req.user?.image,USER_OWNER)
                dataToFrontend.newUserToken = req.newUserToken;
                dataToFrontend.newUserData = {...req.user,image};
            }
            res.status(200).json(dataToFrontend);
        } catch (error) {
            console.log(error.message);
            next(error)
        }
    }
}