import generateOTP from "../../utils/crypto.js";
import sendmail from "../../utils/mailer.js";

export class ResendOtpUser{
    constructor(dependencies){
        this.userRepository = new dependencies.Repositories.MongoUserRepository();
    }

    async execute(id){
        try {
            console.log(id);
            const isUserExist = await this.userRepository.findUserById(id)
            if(isUserExist !== null){
                const otp = generateOTP();
                const mailSend = await sendmail(isUserExist.email,otp);
                if(mailSend){
                    return {
                        otp
                    }
                }else{
                    const error = new Error()
                    error.statusCode = 500;
                    error.reasons = ['Ooops. Error sending email!!']
                    throw error;
                }
            }else{
                const error = new Error()
                error.statusCode = 401;
                error.reasons = ["Invalid Request"]
            }
        } catch (err) {
            console.log(err.message);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}