import generateOTP from "../../utils/crypto.js";
import sendmail from "../../utils/mailer.js";
import { KafkaService } from '../../events/kafkaclient.js'
import { AUTH_TOPIC, TYPE_USER_CREATED } from "../../events/config.js";

export class EmailUserAuth{
    constructor(dependencies){
        this.userRepository = new dependencies.Repositories.MongoUserRepository();
        this.kafkaClient = new KafkaService()
    }

    async execute(email){
        try {
            const findUserExist = await this.userRepository.findUserByEmail(email);
            console.log(findUserExist);
            if(findUserExist){
                if(findUserExist.type === 'EMAIL-AUTH'){
                    if(findUserExist.isVerified){
                        const otp = generateOTP();
                        const mailSend = await sendmail(email,otp)
                        console.log(otp);
                        if(mailSend){
                            return {
                                id: findUserExist._id,
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
                        error.statusCode = 403;
                        error.reasons = ['You are temporarily blocked by Admin.']
                        throw error;
                    }
                }else{
                    const error = new Error()
                    error.statusCode = 400;
                    error.reasons = ['User authentication failed!!']
                    throw error;
                }
            }else{
                const userToInsert = {
                    email,
                    mobile:0,
                    firstname:"Guest",
                    address:{
                        street:'nil',
                        landmark:'nil',
                        city:'nil',
                        state:'nil',
                        pincode:0
                    },
                    isVerified:true,
                    type:'EMAIL-AUTH',
                    password:'nil'
                }
                const createdUser = await this.userRepository.createUser(userToInsert);
                const userWOP = {
                    _id:createdUser._id,
                    email:createdUser.email,
                    mobile:createdUser.mobile,
                    firstname:createdUser.firstname,
                    address:createdUser.address,
                    isVerified:createdUser.isVerified,
                    type:createdUser.type,
                }
                this.kafkaClient.produceMessage(AUTH_TOPIC,{
                    type:TYPE_USER_CREATED,
                    value:JSON.stringify(userWOP)
                })
                console.log(createdUser);
                const otp = generateOTP();
                const mailSend = await sendmail(email,otp);
                console.log("USER",otp);
                if(mailSend){
                    return {
                        id: createdUser._id,
                        otp
                    }
                }else{
                    const error = new Error()
                    error.statusCode = 500;
                    error.reasons = ['Ooops. Error sending email!!']
                    throw error;
                }
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