export class UserMovieQuery{
    constructor(dependencies){
        this.userMovieQueryUseCase = new dependencies.UseCase.UserQueryMovie(dependencies)
    }

    async movieQuery(req,res,next){
        try {
            const resultData = await this.userMovieQueryUseCase.execute(req.body);
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