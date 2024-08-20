export class AdminGetUsers{
    constructor(dependencies){
        this.AdminGetUsersUseCase = new dependencies.UseCase.GetUsers(dependencies)
    }

    async getUsers(req,res,next){
        try {
            const usersData = await this.AdminGetUsersUseCase.execute()
            console.log(usersData);
            const dataToFrontend = {
                usersData,
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