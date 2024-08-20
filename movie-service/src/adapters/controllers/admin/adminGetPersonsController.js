export class AdminGetPersonsFromDB{
    constructor(dependencies){
        this.AdminGetPersonsFromDBUseCase = new dependencies.UseCase.AdminPersonsFromDBGet(dependencies)
    }

    async getPersonsFromDB(req,res,next){
        try {
            const resultData = await this.AdminGetPersonsFromDBUseCase.execute(req.body);
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