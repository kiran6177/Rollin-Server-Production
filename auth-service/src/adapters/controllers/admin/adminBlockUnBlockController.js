export class AdminUserBlockUnblock{
    constructor(dependencies){
        this.adminUserBlockUnblockUseCase = new dependencies.UseCase.UserBlockUnblock(dependencies);
    }

    async blockUnblock(req,res,next){
        try {
            console.log(req.body);
            const userData = await this.adminUserBlockUnblockUseCase.execute(req.body.userid);
            console.log(userData);
            const dataToFrontend = {
                userData,
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