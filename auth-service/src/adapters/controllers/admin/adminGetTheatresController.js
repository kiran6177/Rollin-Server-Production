export class AdminGetTheatres{
    constructor(dependencies){
        this.AdminGetTheatresUseCase = new dependencies.UseCase.GetTheatres(dependencies)
    }

    async getTheatres(req,res,next){
        try {
            const TheatresData = await this.AdminGetTheatresUseCase.execute()
            console.log(TheatresData);
            const dataToFrontend = {
                TheatresData
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