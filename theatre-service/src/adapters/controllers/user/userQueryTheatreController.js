export class UserTheatreQuery{
    constructor(dependencies){
        this.UserTheatreQueryUseCase = new dependencies.UseCase.UserQueryTheatre(dependencies)
    }

    async theatreQuery(req,res,next){
        try {
            const resultData = await this.UserTheatreQueryUseCase.execute(req.body);
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