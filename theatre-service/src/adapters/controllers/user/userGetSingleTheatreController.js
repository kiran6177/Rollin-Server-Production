export class UserGetSingleTheatre{
    constructor(dependencies){
        this.UserGetSingleTheatreUseCase = new dependencies.UseCase.UserSingleTheatreGet(dependencies)
    }

    async getSingleTheatre(req,res,next){
        try {
            const resultData = await this.UserGetSingleTheatreUseCase.execute(req.body);
            const dataToFrontend = {
                resultData,
            }
            res.status(200).json(dataToFrontend)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}