export class UserGetBannerMovies{
    constructor(dependencies){
        this.UserGetBannerMoviesUseCase = new dependencies.UseCase.UserBannerMoviesGet(dependencies)
    }

    async getBannerMovies(req,res,next){
        try {
            const resultData = await this.UserGetBannerMoviesUseCase.execute(req.body);
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