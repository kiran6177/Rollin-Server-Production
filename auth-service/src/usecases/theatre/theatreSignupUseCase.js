import { hash } from "bcrypt";
import { Theatre } from "../../entities/index.js";
import { createRefreshToken, createToken } from "../../utils/jwt.js";
import generateOTP from "../../utils/crypto.js";
import sendmail from "../../utils/mailer.js";
import { KafkaService } from "../../events/kafkaclient.js";
import { AUTH_TOPIC, TYPE_THEATRE_CREATED } from "../../events/config.js";
const SALT_ROUNDS = 10;

export class TheatreSignup{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository();
        this.kafkaClient = new KafkaService()
    }

    async execute(data){
        try {
            const { name , email , password } = data;
            const existingTheatre = await this.theatreRepository.findTheatreByEmail(email);
            console.log(existingTheatre);
            if(existingTheatre === null){
                
                const otp = generateOTP();
                const mailSend = await sendmail(email,otp)
                if(mailSend){

                    const hashed = await hash(password,SALT_ROUNDS)
                    const theatre = new Theatre({ name , email , password:hashed })
                    const createdTheatre = await this.theatreRepository.createTheatre(theatre);
                    const theatreData = {
                        id:createdTheatre._id,
                        type:'register'
                        // isAccepted:createdTheatre.isAccepted
                        // name:createdTheatre.name,
                        // email:createdTheatre.email,
                        // isCompleted:createdTheatre.isCompleted,
                        // isVerified:createdTheatre.isVerified
                    }
                    const theatreToPub = {
                        _id:createdTheatre._id,
                        name:createdTheatre.name,
                        email:createdTheatre.email,
                        images:createdTheatre.images,
                        authType:createdTheatre.authType,
                        isVerified:createdTheatre.isVerified,
                        isCompleted:createdTheatre.isCompleted,
                        isAccepted:createdTheatre.isAccepted,
                        isBlocked:createdTheatre.isBlocked,
                    }
                    this.kafkaClient.produceMessage(AUTH_TOPIC,{
                        type:TYPE_THEATRE_CREATED,
                        value:JSON.stringify(theatreToPub)
                    })
                    return {
                        theatreData,
                        otp
                    }
                }else{
                    const error = new Error();
                    error.statusCode = 500;
                    error.reasons = ['Ooops!! Error sending mail!!'];
                    throw error
                }
            }else{
                const error = new Error();
                error.statusCode = 404;
                error.reasons = ['Ooops!! User already exists!!'];
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