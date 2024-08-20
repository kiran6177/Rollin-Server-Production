import { createRefreshToken, createToken } from "../../utils/jwt.js";
import { KafkaService } from '../../events/kafkaclient.js'
import { AUTH_TOPIC, TYPE_THEATRE_UPDATED } from "../../events/config.js";

export class VerifyTheatre{
    constructor(dependencies){
        this.theatreRepository  = new dependencies.Repositories.MongoTheatreRepository();
        this.kafkaClient = new KafkaService()
    }

    async execute({id,otp},session,type){
        try {
            console.log(id,otp);
            console.log(session);
            if(session?.theatreOTP){
                const sessionOTP = session?.theatreOTP
                if(parseInt(sessionOTP) === otp){
                    const updateTheatre = await this.theatreRepository.updateTheatreById(id,{isAccepted:true});
                    const dataToPub = {
                        _id:updateTheatre._id,
                        isAccepted:updateTheatre.isAccepted
                    }
                    this.kafkaClient.produceMessage(AUTH_TOPIC,{
                        type:TYPE_THEATRE_UPDATED,
                        value:JSON.stringify(dataToPub)
                    })
                    if(updateTheatre?.isVerified && updateTheatre?.isAccepted){
                        const theatreData = {
                            id:updateTheatre._id,
                            name:updateTheatre.name,
                            email:updateTheatre.email,
                            isCompleted:updateTheatre.isCompleted,
                            isAccepted:updateTheatre.isAccepted,
                            isVerified:updateTheatre.isVerified,
                            isBlocked:updateTheatre.isBlocked
                        }
                        const accessToken = await createToken({...theatreData,role:'THEATRE'});
                        const refreshToken = await createRefreshToken({id:theatreData.id,role:'THEATRE'});
                        return {
                            theatreData,
                            accessToken,
                            refreshToken
                        }
                    }else{
                        if(type === 'login'){
                            const error = new Error();
                            error.statusCode = 403;
                            error.reasons = ['Registration completed. You are under verfication.'];
                            throw error;
                        }else{
                            return {
                                theatreData :null,
                                accessToken : null,
                                refreshToken:null
                            }
                        }
                    }
                }else{
                    const error = new Error();
                    error.statusCode = 400;
                    error.reasons = ['Invalid OTP!!'];
                    throw error
                }
            }else{
                const error = new Error();
                error.statusCode = 400;
                error.reasons = ['Ooops!! OTP timed out!!'];
                throw error
            }
        } catch (err) {
            const error = new Error(err.message)
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }

}