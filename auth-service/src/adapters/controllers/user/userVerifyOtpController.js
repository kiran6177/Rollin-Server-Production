export class UserVerifyOtp{
    constructor(dependencies){
        this.userVerifyOtpUseCase = new dependencies.UseCase.VerifyUserOtp(dependencies)
    }

    async verifyUser(req,res,next){
        try {
            console.log(req.session);
            console.log(req.body);
            const {data,accessToken,refreshToken} = await this.userVerifyOtpUseCase.execute(req.body.id,req.body.otp,req.session.userEmailOtp)
            console.log(data,accessToken,refreshToken);
            req.session.userOtpTime = null;
            req.session.userEmailOtp = null;
            res.cookie('refreshToken',refreshToken,{
                httpOnly:true,
                secure:true,
                maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
            })
            res.status(200).json({data,accessToken});
        } catch (error) {
            console.log(error.message);
            next(error)
        }
    }
}