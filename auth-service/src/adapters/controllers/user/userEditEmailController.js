import { AwsConfig } from "../../../utils/aws-s3.js";
const USER_OWNER = 'user'

export class UserEditEmail{
    constructor(dependencies){
        this.userEmailEditUseCase = new dependencies.UseCase.UserEmailEdit(dependencies)
        this.awsConfig = new AwsConfig()
    }
    async editEmail(req,res,next){
        try {
            const resultData = await this.userEmailEditUseCase.execute(req.body,req.user)
            const dataToFrontend = {}
            if(resultData.otp){
                dataToFrontend.resultData = true 
                req.session.userEmailOtp = resultData?.otp;
                req.session.userOtpTime = Date.now()
                req.session.updatedUserData = resultData?.data
            }
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