import { AUTH_TOPIC, TYPE_USER_UPDATED } from "../../events/config.js";
import { KafkaService } from "../../events/kafkaclient.js";
import { AwsConfig } from "../../utils/aws-s3.js";
const USER_OWNER = 'user'

export class VerifyProfileOtp{
    constructor(dependencies){
        this.userRepository = new dependencies.Repositories.MongoUserRepository()
        this.kafkaClient = new KafkaService()
        this.awsConfig = new AwsConfig()
    }

    async execute({otp},{userEmailOtp,updatedUserData},{id}){
        try {
            console.log("DATA",updatedUserData,userEmailOtp,id,otp);
            const userExist = await this.userRepository.findUserById(id);
            console.log(userExist);
            if(userExist){
                if(userEmailOtp){
                    if(parseInt(userEmailOtp) === otp){
                        const dataToUpdate = {
                            email:updatedUserData.email,
                            type:'EMAIL-AUTH'
                        }
                        const updateUser = await this.userRepository.updateUserById(id,dataToUpdate)
                        const userWOP = {
                            id:updateUser._id,
                            email:updateUser.email,
                            mobile:updateUser.mobile,
                            firstname:updateUser.firstname,
                            lastname:updateUser.lastname,
                            authtype:updateUser.type,
                            address:updateUser.address,
                            walletBalance:updateUser.walletBalance,
                        }
                        this.kafkaClient.produceMessage(AUTH_TOPIC,{
                            type:TYPE_USER_UPDATED,
                            value:JSON.stringify({_id:updateUser._id,email:updateUser.email,type:updateUser.type})
                        })
                        const image = await this.awsConfig.getImage(updateUser?.image,USER_OWNER)
                        return {...userWOP,image}
                    }else{
                        const error = new Error()
                        error.statusCode = 500;
                        error.reasons = ['Ooops. Invalid OTP!!']
                        throw error;
                    }
                }else{
                    const error = new Error()
                    error.statusCode = 500;
                    error.reasons = ['Ooops. OTP timed out!!']
                    throw error;
                }
            }else{
                const error = new Error()
                error.statusCode = 500;
                error.reasons = ['Ooops. Some error occured. Please retry!!']
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