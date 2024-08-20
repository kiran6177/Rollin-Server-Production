export class OtpValidator{
    static async validateTheatreOtp(req,res,next){
        try {
            const now = Date.now()
            if((now - req.session.theatreOTPtime) > 60000){
                req.session.theatreOTPtime = null;
                req.session.theatreOTP = null;
            }
            next()
        } catch (error) {
            console.log(err.message);
            next(err);
        }
    }
    static async validateUserOtp(req,res,next){
        try {
            const now = Date.now()
            if((now - req.session.userOtpTime) > 60000){
                req.session.userOtpTime = null;
                req.session.userEmailOtp = null;
            }
            next()
        } catch (error) {
            console.log(err.message);
            next(err);
        }
    }
}