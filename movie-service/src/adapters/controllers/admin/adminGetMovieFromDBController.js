export class AdminGetMoviesFromDB{
    constructor(dependencies){
        this.AdminGetMoviesFromDBUseCase = new dependencies.UseCase.AdminMoviesFromDBGet(dependencies)
    }

    async getMoviesFromDB(req,res,next){
        try {
            const resultData = await this.AdminGetMoviesFromDBUseCase.execute(req.body);
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