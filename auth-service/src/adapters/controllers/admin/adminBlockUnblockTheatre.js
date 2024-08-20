export class AdminTheatreBlockUnblock{
    constructor(dependencies){
        this.adminTheatreBlockUnblockUseCase = new dependencies.UseCase.TheatreBlockUnblock(dependencies);
    }

    async blockUnblock(req,res,next){
        try {
            console.log(req.body);
            const theatreData = await this.adminTheatreBlockUnblockUseCase.execute(req.body.theatreid);
            console.log(theatreData);
            const dataToFrontend = {
                theatreData,
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