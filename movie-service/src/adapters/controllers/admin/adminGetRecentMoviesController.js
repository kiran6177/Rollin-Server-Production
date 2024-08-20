export class AdminGetRecentMovies{
    constructor(dependencies){
        this.adminGetRecentMoviesUseCase = new dependencies.UseCase.AdminRecentMoviesGet(dependencies)
    }

    async getRecentMovies(req,res,next){
        try {
            const resultData = await this.adminGetRecentMoviesUseCase.execute(req.query);
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