import axios from "axios";
import { createRefreshToken, createToken } from "../../utils/jwt.js";
import { AwsConfig } from "../../utils/aws-s3.js";
import { KafkaService } from '../../events/kafkaclient.js'
import { AUTH_TOPIC, TYPE_THEATRE_CREATED, TYPE_THEATRE_UPDATED } from '../../events/config.js'
const THEATRE_OWNER = 'theatre'
 
export class TheatreGoogleAuth{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.awsConfig = new AwsConfig()
        this.kafkaClient = new KafkaService()
    }

    async execute(googleToken){
        try {
            console.log(googleToken);
            const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo',{headers:{
                Authorization: `Bearer ${googleToken}`
            }})
            const theatreData = res.data;
            let resultData;
            if(theatreData.email_verified){
                const theatreExists = await this.theatreRepository.findTheatreByEmail(theatreData.email)
                console.log("exists",theatreExists);
                    if(theatreExists === null){
                        const createdData = await this.theatreRepository.createTheatre({name:theatreData.name,email:theatreData.email,password:'nil'})
                        const theatreToPub = {
                            _id:createdData._id,
                            name:createdData.name,
                            email:createdData.email,
                            images:createdData.images,
                            authType:createdData.authType,
                            isVerified:createdData.isVerified,
                            isCompleted:createdData.isCompleted,
                            isAccepted:createdData.isAccepted,
                            isBlocked:createdData.isBlocked,
                        }
                        this.kafkaClient.produceMessage(AUTH_TOPIC,{
                            type:TYPE_THEATRE_CREATED,
                            value:JSON.stringify(theatreToPub)
                        })
                        const updatedData = await this.theatreRepository.updateTheatreById(createdData._id,{authType:'GOOGLE_AUTH',isAccepted:true})
                        console.log("created",updatedData);
                        const dataToPub = {
                            _id:updatedData._id,
                            authType:updatedData.authType,
                            isAccepted:updatedData.isAccepted
                        }
                        this.kafkaClient.produceMessage(AUTH_TOPIC,{
                            type:TYPE_THEATRE_UPDATED,
                            value:JSON.stringify(dataToPub)
                        })
                        resultData = {
                            id:updatedData._id,
                            name:updatedData.name,
                            email:updatedData.email,
                            isCompleted:updatedData.isCompleted,
                            isVerified:updatedData.isVerified,
                            isAccepted:updatedData.isAccepted,
                            isBlocked:updatedData.isBlocked
                        }
                    }else{

                        if(theatreExists.authType !== 'GOOGLE_AUTH'){
                            const error = new Error();
                            error.statusCode = 404;
                            error.reasons = ['User authentication failed!'];
                            throw error;
                        }
                        
                        resultData = {
                            id:theatreExists._id,
                            name:theatreExists.name,
                            email:theatreExists.email,
                            isCompleted:theatreExists.isCompleted,
                            isAccepted:theatreExists.isAccepted,
                            isVerified:theatreExists.isVerified,
                            isBlocked:theatreExists.isBlocked,
                            address:theatreExists?.address || {},
                            location:theatreExists?.location || {}
                        }
                    }
                    let accessToken;
                    let refreshToken;
                    let images = [];
                    if(resultData.isVerified && !resultData.isBlocked){
                            for(let image of theatreExists.images){
                                const url = await this.awsConfig.getImage(image,THEATRE_OWNER)
                                if(url){
                                    images.push({url,filename:image})
                                }else{
                                    // write unable to fetch image error
                                }
                            }
                         accessToken = await createToken({...resultData,role:'THEATRE'});
                         refreshToken = await createRefreshToken({id:resultData.id,role:'THEATRE'});
                    }else{
                        accessToken = null;
                        refreshToken = null;
                    }
                    resultData.images = images
                    return {
                        data:resultData,
                        accessToken,
                        refreshToken
                    }
            }else{
                const error = new Error()
                error.statusCode = 400;
                error.reasons = ['User is not verified']
                throw error;
            }
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }

}