export class UserResendOtp{
    constructor(dependencies){
        this.userResendOtpUseCase = new dependencies.UseCase.ResendOtpUser(dependencies)
    }

    async resendOtp(req,res,next){
        try {
            const { id } = req.body;
            const resend = await this.userResendOtpUseCase.execute(id);
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