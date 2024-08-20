export class TheatreOtpVerify{
    constructor(dependencies){
        this.theatreOtpVerifyUseCase = new dependencies.UseCase.VerifyTheatre(dependencies);
    }

    async verifyTheatre(req,res,next){
        try {
            const { type } = req.params;
            console.log(req.body);
            console.log(req.session);
            const {theatreData,accessToken,refreshToken} = await this.theatreOtpVerifyUseCase.execute(req.body,req.session,type);
            console.log(theatreData,accessToken,refreshToken);
            if(type === 'login'){
                req.session.theatreOTPtime = null;
                req.session.theatreOTP = null;
                res.cookie('theatreRefreshToken',refreshToken,{
                    httpOnly:true,
                    secure:true,
                    maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
                })
                return res.status(200).json({theatreData,accessToken})
            }else if(type === 'register'){
                console.log("gggg");
                req.session.theatreOTPtime = null;
                req.session.theatreOTP = null;
                return res.status(200).json({success:true})
            }
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

}