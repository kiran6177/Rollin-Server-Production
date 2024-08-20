export class UserGetMoviesByGenre{
    constructor(dependencies){
        this.UserGetMoviesByGenreUseCase = new dependencies.UseCase.UserMoviesByGenreGet(dependencies)
    }

    async getMoviesByGenre(req,res,next){
        try {
            const resultData = await this.UserGetMoviesByGenreUseCase.execute(req.body);
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