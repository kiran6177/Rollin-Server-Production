export class TheatreSignup{
    constructor(dependencies){
        this.theatreSignupUseCase = new dependencies.UseCase.TheatreSignup(dependencies)
    }

    async signup(req,res,next){
        try {
            const {theatreData,otp} = await this.theatreSignupUseCase.execute(req.body);
            req.session.theatreOTP = otp;
            req.session.theatreOTPtime = Date.now()
            console.log(otp);
            res.status(200).json({
                theatreData,
            })
        } catch (error) {
            console.log(error.message);
            next(error)
        }
    }

}