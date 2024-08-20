import generateOTP from "../../utils/crypto.js";
import sendmail from "../../utils/mailer.js";
import { KafkaService } from '../../events/kafkaclient.js'
import { AUTH_TOPIC, TYPE_USER_UPDATED } from "../../events/config.js";
import { AwsConfig } from "../../utils/aws-s3.js";
const USER_OWNER = 'user'

export class UserProfileEdit{
    constructor(dependencies){
        this.userRepository = new dependencies.Repositories.MongoUserRepository();
        this.kafkaClient = new KafkaService()
        this.awsConfig = new AwsConfig()
    }

    async execute({firstname,lastname,mobile,street,landmark,city,state,pincode},{id},file){
        try { 
            console.log(firstname,lastname,mobile,street,landmark,city,state,pincode,id,file);
            if(firstname && lastname  && mobile ){
                const userData = await this.userRepository.findUserById(id)
                console.log(userData);
                
                    let dataToUpdate;
                    if(file){
                        if(userData?.image){
                            const deleteImage = await this.awsConfig.deleteImage(userData.image,USER_OWNER)
                            console.log("DEL",deleteImage);
                        }
                        const filename = Date.now()+file.originalname;
                        const trimmed = filename.replace(/\s+/g, "");
                        console.log(trimmed);
                        await this.awsConfig.uploadImage(trimmed,file.buffer,file.mimetype,USER_OWNER)
                        dataToUpdate = {
                            firstname,
                            lastname,
                            mobile,
                            image:trimmed,
                            address:{
                                street:street ? street : 'NIL',
                                landmark:landmark ? landmark : 'NIL',
                                city:city ? city : 'NIL',
                                state:state ? state : 'NIL',
                                pincode:pincode ? pincode : 0
                            }
                        }
                    }else{
                         dataToUpdate = {
                            firstname,
                            lastname,
                            mobile,
                            address:{
                                street:street ? street : 'NIL',
                                landmark:landmark ? landmark : 'NIL',
                                city:city ? city : 'NIL',
                                state:state ? state : 'NIL',
                                pincode:pincode ? pincode : 0
                            }
                        }
                    }
                    
                    const updatedUser = await this.userRepository.updateUserById(id,dataToUpdate)
                    const userWOP = {
                        id:updatedUser._id,
                        email:updatedUser.email,
                        mobile:updatedUser.mobile,
                        firstname:updatedUser.firstname,
                        lastname:updatedUser.lastname,
                        authtype:updatedUser.type,
                        address:updatedUser.address,
                        walletBalance:updatedUser.walletBalance,
                    }
                    const image = await this.awsConfig.getImage(updatedUser?.image,USER_OWNER)
                    this.kafkaClient.produceMessage(AUTH_TOPIC,{
                        type:TYPE_USER_UPDATED,
                        value:JSON.stringify({_id:updatedUser._id,...dataToUpdate})
                    })
                    return {...userWOP,image}
                
            }else{
                const error = new Error()
                error.statusCode = 500;
                error.reasons = ['Invalid input data!!']
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