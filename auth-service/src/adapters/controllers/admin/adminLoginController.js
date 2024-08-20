export class AdminLogin{
    constructor(dependencies){
        this.adminLoginUseCase = new dependencies.UseCase.AdminLogin(dependencies);
    }

    async loginAdmin(req,res,next){
        try {
            const {adminData,accessToken,refreshToken} =  await this.adminLoginUseCase.execute(req.body)
            res.cookie('adminRefreshToken',refreshToken,{
                httpOnly:true,
                secure:true,
                maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
            })
            res.status(202).json({data:adminData,accessToken});
        } catch (error) {
            console.log(error.message);
            next(error)
        }
    }

}