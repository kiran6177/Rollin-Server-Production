export class AdminGetAllTMDBMovies{
    constructor(dependencies){
        this.AdminGetAllTMDBMoviesUseCase = new dependencies.UseCase.AdminAllTMDBMoviesGet(dependencies)
    }

    async getAllTMDBMovies(req,res,next){
        try {
            const resultData = await this.AdminGetAllTMDBMoviesUseCase.execute(req.body);
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