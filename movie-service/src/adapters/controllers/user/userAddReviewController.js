import { AwsConfig } from "../../../utils/aws-s3.js";
const USER_OWNER = 'user'

export class UserAddReview{
    constructor(dependencies){
        this.userAddReviewUseCase = new dependencies.UseCase.UserReviewAdd(dependencies)
        this.awsConfig = new AwsConfig()

    }

    async addReview(req,res,next){
        try {
            const resultData = await this.userAddReviewUseCase.execute(req.body,req?.user);
            const dataToFrontend = {
                resultData,
            }
            if(req?.newUserToken){
                let url;
                if(req?.user && req?.user?.image){
                     url = await this.awsConfig.getImage(req.user.image,USER_OWNER)
                }
                dataToFrontend.newUserToken = req?.newUserToken
                dataToFrontend.newUserData = {...req?.user,image:url}
            }
            res.status(200).json(dataToFrontend)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}