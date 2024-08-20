export class AdminGetHighGrossMovies{
    constructor(dependencies){
        this.adminGetHighGrossMoviesUseCase = new dependencies.UseCase.AdminHighGrossMoviesGet(dependencies);
    }

    async getHighGrossMovies(req,res,next){
        try {
            const resultData = await this.adminGetHighGrossMoviesUseCase.execute(req.query);
            console.log(resultData);
            const dataToFrontend = {
                resultData
            }
            if(req?.newAdminToken){
                dataToFrontend.newAdminToken = req?.newAdminToken
                dataToFrontend.newAdminData = req?.admin
            }
            res.status(200).json(dataToFrontend)
        } catch (error) {
            console.log(error);
            next(error); 
        }
    }
}