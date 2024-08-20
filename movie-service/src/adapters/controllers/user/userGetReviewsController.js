export class UserGetReview{
    constructor(dependencies){
        this.userGetReviewUseCase = new dependencies.UseCase.UserReviewGet(dependencies)
    }

    async getReview(req,res,next){
        try {
            const resultData = await this.userGetReviewUseCase.execute(req.body);
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