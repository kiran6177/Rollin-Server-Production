export class AdminDisableMovie{
    constructor(dependencies){
        this.adminDisableMovieUseCase = new dependencies.UseCase.AdminMovieDisable(dependencies)
    }

    async disableMovie(req,res,next){
        try {
            const resultData = await this.adminDisableMovieUseCase.execute(req.body);
            const dataToFrontend = {
                resultData,
            }
            if(req?.newAdminToken){
                dataToFrontend.newAdminToken = req?.newAdminToken
                dataToFrontend.newAdminData = req?.admin
            }
            res.status(200).json(dataToFrontend)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}