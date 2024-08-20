export class AdminAddMovieToDB{
    constructor(dependencies){
        this.adminAddMovieToDBUseCase = new dependencies.UseCase.AdminMovieToDBAdd(dependencies)
    }

    async addMovieToDB(req,res,next){
        try {
            const resultData = await this.adminAddMovieToDBUseCase.execute(req.body);
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