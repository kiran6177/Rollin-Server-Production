import { AUTH_TOPIC, TYPE_THEATRE_UPDATED } from "../../events/config.js";
import { KafkaService } from "../../events/kafkaclient.js";

export class TheatreApprove{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.kafkaClient =  new KafkaService()
    }

    async execute(theatreid){
        try {
            const theatreExist = await this.theatreRepository.findTheatreById(theatreid)
            console.log(theatreExist);
            if(theatreExist){
                const updateTheatre = await this.theatreRepository.updateTheatreById(theatreid,{isVerified:true})
                const updateTheatreWOP = {
                    id:updateTheatre._id,
                    name:updateTheatre.name,
                    email:updateTheatre.email,
                    isVerified:updateTheatre.isVerified,
                    isCompleted:updateTheatre.isCompleted,
                    isAccepted:updateTheatre.isAccepted,
                    isBlocked:updateTheatre.isBlocked,
                    address:updateTheatre.address ? updateTheatre.address : null,
                    location:updateTheatre.location ? updateTheatre.location : null
                }
                this.kafkaClient.produceMessage(AUTH_TOPIC,{
                    type:TYPE_THEATRE_UPDATED,
                    value:JSON.stringify({_id:updateTheatreWOP.id,isVerified:updateTheatreWOP.isVerified})
                })
                return updateTheatreWOP
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