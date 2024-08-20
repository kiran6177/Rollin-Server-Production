export class UserGetPerson{
    constructor(dependencies){
        this.userGetPersonUseCase = new dependencies.UseCase.UserPersonGet(dependencies)
    }

    async getPerson(req,res,next){
        try {
            const resultData = await this.userGetPersonUseCase.execute(req.body);
            const dataToFrontend = {
                resultData,
            }
            // if(req?.newUserToken){
            //     dataToFrontend.newUserToken = req?.newUserToken
            //     dataToFrontend.newUserData = req?.user
            // }
            res.status(200).json(dataToFrontend)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}