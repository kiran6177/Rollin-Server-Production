export class AdminEnableMovie{
    constructor(dependencies){
        this.adminEnableMovieUseCase = new dependencies.UseCase.AdminMovieEnable(dependencies)
    }

    async enableMovie(req,res,next){
        try {
            const resultData = await this.adminEnableMovieUseCase.execute(req.body);
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