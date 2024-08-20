import { AwsConfig } from "../../../utils/aws-s3.js";
const USER_OWNER = 'user'

export class UserSetMovieReminder{
    constructor(dependencies){
        this.userMovieReminderSetUseCase = new dependencies.UseCase.UserMovieReminderSet(dependencies)
        this.awsConfig = new AwsConfig()
    }
    async setMovieReminder(req,res,next){
        try {
            const resultData = await this.userMovieReminderSetUseCase.execute(req.body,req?.user);
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