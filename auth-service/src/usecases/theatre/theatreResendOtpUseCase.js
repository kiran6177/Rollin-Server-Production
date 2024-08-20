import generateOTP from "../../utils/crypto.js";
import sendmail from "../../utils/mailer.js";

export class TheatreResendOTP{
    constructor(dependencies){
        this.theatreRepository  = new dependencies.Repositories.MongoTheatreRepository();
    }

    async execute(id){
        try {
            console.log(id);
            const theatreExist = await this.theatreRepository.findTheatreById(id)
            if(theatreExist?.isAccepted === false){
                const otp = generateOTP();
                const mailSend = await sendmail(theatreExist.email,otp);
                if(mailSend){
                    return {
                        otp
                    }
                }
            }else{
                const error = new Error();
                error.statusCode = 404;
                error.reasons = ['Ooops!! Error sending mail!!'];
                throw error
            }
        } catch (err) {
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}