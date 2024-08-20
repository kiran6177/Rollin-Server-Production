export class AdminGetTMDBMovieDetail{
    constructor(dependencies){
        this.AdminGetTMDBMovieDetailUseCase = new dependencies.UseCase.AdminTMDBMovieDetailGet(dependencies)
    }

    async getTMDBMovieDetail(req,res,next){
        try {
            const resultData = await this.AdminGetTMDBMovieDetailUseCase.execute(req.body);
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