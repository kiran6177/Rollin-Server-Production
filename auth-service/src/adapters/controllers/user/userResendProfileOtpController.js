export class UserResendProfileOtp{
    constructor(dependencies){
        this.userResendProfileOtpUseCase = new dependencies.UseCase.ResendProfileOtpUser(dependencies)
    }

    async resendProfileOtp(req,res,next){
        try {
            const resend = await this.userResendProfileOtpUseCase.execute(req.body,req?.user);
            console.log(resend);
            req.session.userEmailOtp = resend?.otp;
            req.session.userOtpTime = Date.now()
            res.status(201).json({success:true})
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}