export class UserGetSingleMovie{
    constructor(dependencies){
        this.userGetSingleMovieUseCase = new dependencies.UseCase.UserSingleMovieGet(dependencies)
    }

    async getSingleMovie(req,res,next){
        try {
            const resultData = await this.userGetSingleMovieUseCase.execute(req.body);
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