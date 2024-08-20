export class TheatreResend{
    constructor(dependencies){
        this.theatreResendUseCase = new dependencies.UseCase.TheatreResendOTP(dependencies)
    }

    async resendOtp(req,res,next){
        try {
            const resendSuccess = await this.theatreResendUseCase.execute(req.body?.id);
            console.log(resendSuccess);
            if(resendSuccess?.otp){
                req.session.theatreOTP = resendSuccess.otp;
                req.session.theatreOTPtime = Date.now()
                return res.status(200).json({success:true})
            }else{
                const error = new Error();
                error.statusCode = 500;
                error.reasons = ['Ooops!! Some error occurred!!'];
                throw error
            }
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

}