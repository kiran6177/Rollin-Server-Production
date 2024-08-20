export class TheatreLogin{
    constructor(dependencies){
        this.theatreLoginUseCase = new dependencies.UseCase.TheatreLogin(dependencies);
        this.theatreGoogleLoginUseCase = new dependencies.UseCase.TheatreGoogleAuth(dependencies);
    }

    async login(req,res,next){
        try {
            const { type } = req.params;
            console.log(type);
            console.log(req.body);
            let theatreData;
            let accessToken;
            let refreshToken;
            let theatreotp;
            if(type === 'google'){
                const { access_token } = req.body;
                const theatreResults = await this.theatreGoogleLoginUseCase.execute(access_token);
                theatreData = theatreResults.data;
                accessToken = theatreResults.accessToken;
                refreshToken = theatreResults.refreshToken;
                console.log(theatreResults);
            }else{
            const {  email , password } = req.body;
            const theatreResults = await this.theatreLoginUseCase.execute({email,password});
            theatreData = theatreResults.theatreData;
            accessToken = theatreResults.accessToken;
            refreshToken = theatreResults.refreshToken;
            theatreotp = theatreResults.otp
            // console.log(theatreResults.refreshToken);
            }
            if( !accessToken && !refreshToken){
                if(!theatreData.isAccepted){
                    console.log("OTP",theatreotp);
                    req.session.theatreOTP = theatreotp
                    req.session.theatreOTPtime = Date.now()
                   return res.status(200).json({theatreData})
                }else if(theatreData.isCompleted && !theatreData.isVerified){
                    const error = new Error();
                    error.statusCode = 401;
                    error.reasons = ['Your credentials are under verfication by admin.']
                    throw error
                }else if(theatreData.isBlocked){
                    const error = new Error();
                    error.statusCode = 401;
                    error.reasons = ['You are tempororily blocked by Admin!']
                    throw error
                }
                // const error = new Error();
                // error.statusCode = 401;
                // error.reasons = ['Unauthorized!']
                // throw error
            }
            if(theatreData.isCompleted && theatreData.isVerified){
                res.cookie('theatreRefreshToken',refreshToken,{
                    httpOnly:true,
                    secure:true,
                    maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
                })
                res.status(200).json({theatreData,accessToken})
            }else{
                res.status(200).json({theatreData})
            }
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

}