export class AdminGetRegistrationDetails{
    constructor(dependencies){
        this.adminGetRegistrationDetailsUseCase = new dependencies.UseCase.AdminRegistrationDetailsGet(dependencies)
    }

    async getRegistrationDetails(req,res,next){
        try {
            const resultData = await this.adminGetRegistrationDetailsUseCase.execute(req.body)
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
            next(error)
        }
    }
}