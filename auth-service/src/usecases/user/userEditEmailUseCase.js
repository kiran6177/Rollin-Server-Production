import generateOTP from "../../utils/crypto.js";
import sendmail from "../../utils/mailer.js";
import { KafkaService } from '../../events/kafkaclient.js'
import { AUTH_TOPIC, TYPE_USER_UPDATED } from "../../events/config.js";
const USER_OWNER = 'user'

export class UserEmailEdit{
    constructor(dependencies){
        this.userRepository = new dependencies.Repositories.MongoUserRepository();
        this.kafkaClient = new KafkaService()
    }

    async execute({email},{id}){
        try {
            console.log(email,id);
            const userData = await this.userRepository.findUserById(id)
            const findUserExist = await this.userRepository.findUserByEmail(email);
            console.log(findUserExist);
            if(!findUserExist){
                if(userData){
                    const otp = generateOTP()
                    const mailSend = await sendmail(email,otp);
                    console.log("UPDATE OTP",otp);
                    const data = {email}
                    return {otp,data}
                }else{
                    const error = new Error()
                    error.statusCode = 406;
                    error.reasons = ['Invalid Request!!']
                    throw error;
                }
            }else{
                const error = new Error()
                error.statusCode = 400;
                error.reasons = ['Account already exist in this email!!']
                throw error;
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