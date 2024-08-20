import generateOTP from "../../utils/crypto.js";
import sendmail from "../../utils/mailer.js";

export class ResendProfileOtpUser{
    constructor(dependencies){
        this.userRepository = new dependencies.Repositories.MongoUserRepository();
    }

    async execute({email},{id}){
        try {
            const userExist = await this.userRepository.findUserById(id);
            console.log(userExist);
            if(userExist !== null){
                const otp = generateOTP();
                const mailSend = await sendmail(email,otp);
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