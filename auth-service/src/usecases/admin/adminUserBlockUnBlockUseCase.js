import { AUTH_TOPIC, TYPE_USER_UPDATED } from "../../events/config.js";
import { KafkaService } from "../../events/kafkaclient.js";

export class UserBlockUnblock{
    constructor(dependencies){
        this.userRepository = new dependencies.Repositories.MongoUserRepository()
        this.kafkaClient = new KafkaService()
    }

    async execute(userid){
        try {
            const userExist = await this.userRepository.findUserById(userid)
            console.log(userExist);
            if(userExist){
                const updateUser = await this.userRepository.updateUserById(userid,{isVerified:!userExist.isVerified})
                const updateUserWOP = {
                    id:updateUser._id,
                    email:updateUser.email,
                    mobile:updateUser.mobile,
                    firstname:updateUser.firstname,
                    lastname:updateUser.lastname,
                    isVerified:updateUser.isVerified,
                }
                this.kafkaClient.produceMessage(AUTH_TOPIC,{
                    type:TYPE_USER_UPDATED,
                    value:JSON.stringify({_id:updateUserWOP.id,isVerified:updateUserWOP.isVerified})
                })
                return updateUserWOP
            }else{
                const error = new Error()
                error.statusCode = 400;
                error.reasons = ['ERROR. Unable to perform this action!!']
                throw error;
            }
        } catch (err) {
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}