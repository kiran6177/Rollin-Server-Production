export class AdminTheatreApprove{
    constructor(dependencies){
        this.adminTheatreApproveUseCase = new dependencies.UseCase.TheatreApprove(dependencies);
    }

    async approve(req,res,next){
        try {
            console.log(req.body);
            const theatreData = await this.adminTheatreApproveUseCase.execute(req.body.theatreid);
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