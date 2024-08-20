export class UserGetAllMoviesWithFilter{
    constructor(dependencies){
        this.UserGetAllMoviesWithFilterUseCase = new dependencies.UseCase.UserAllMoviesWithFilterGet(dependencies)
    }

    async getAllMoviesWithFilter(req,res,next){
        try {
            const resultData = await this.UserGetAllMoviesWithFilterUseCase.execute(req.body);
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