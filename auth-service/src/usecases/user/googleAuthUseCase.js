import axios from 'axios'
import { createToken, createRefreshToken } from '../../utils/jwt.js';
import { KafkaService } from '../../events/kafkaclient.js';
import { AUTH_TOPIC, TYPE_USER_CREATED } from '../../events/config.js';
import { AwsConfig } from '../../utils/aws-s3.js';
const USER_OWNER = 'user'

export class GoogleUserAuth{
    constructor(dependencies){
        this.userRepository = new dependencies.Repositories.MongoUserRepository();
        this.kafkaClient = new KafkaService()
        this.awsConfig = new AwsConfig()
    }

    async execute(access_token){
        try{
            const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo',{headers:{
                Authorization: `Bearer ${access_token}`
            }})
            const userData = res.data;
            if(userData.email_verified){
                // const data =  await this.userRepository.loginGoogle(userData)
                const userExist = await this.userRepository.findUserByEmail(userData.email);
                let data;
                if(userExist){
                    let image;
                    if(userExist?.image){
                        image = await this.awsConfig.getImage(userExist.image,USER_OWNER)
                    }
                    if(userExist.isVerified){
                        data = {
                            id:userExist.id,
                            email:userExist.email,
                            mobile:userExist.mobile,
                            firstname:userExist.firstname,
                            lastname:userExist.lastname,
                            image,
                            authtype:userExist.type,
                            address:userExist.address,
                            walletBalance:userExist.walletBalance,
                        }
                    }else{
                        const error = new Error()
                        error.statusCode = 403;
                        error.reasons = ['You are temporarily blocked by Admin.']
                        throw error;
                    }
                }
                else{
                    const firstname = userData.name.split(' ')[0];
                    const lastname = userData.name.split(' ')[1];
                    const userToInsert = {
                        email: userData.email,
                        mobile:0,
                        firstname,
                        lastname,
                        address:{
                            street:'nil',
                            landmark:'nil',
                            city:'nil',
                            state:'nil',
                            pincode:0
                        },
                        isVerified:true,
                        type:'GOOGLE-AUTH',
                        password:'nil'
                    }

                    const udata = await this.userRepository.createUser(userToInsert)
                    let image;
                    if(udata?.image){
                        image = await this.awsConfig.getImage(udata.image,USER_OWNER)
                    }
                    data = {
                        id:udata._id,
                        email:udata.email,
                        mobile:udata.mobile,
                        firstname:udata.firstname,
                        lastname:udata.lastname,
                        image,
                        authtype:udata.type,
                        address:udata.address,
                        walletBalance:udata.walletBalance,
                    }
                    const dataToPub = {
                        _id:udata._id,
                        email:udata.email,
                        mobile:udata.mobile,
                        firstname:udata.firstname,
                        lastname:udata.lastname,
                        image:udata.image,
                        address:udata.address,
                        walletBalance:udata.walletBalance,
                        type:udata.type,
                        isVerified:udata.isVerified
                    }
                    this.kafkaClient.produceMessage(AUTH_TOPIC,{
                        type:TYPE_USER_CREATED,
                        value:JSON.stringify(dataToPub)
                    })
                }

                console.log(data);
                const accessToken = await createToken({...data,role:'USER'});
                const refreshToken = await createRefreshToken({id:data.id,role:'USER'});

                return {
                    data,
                    accessToken,
                    refreshToken
                }
            }else{
                const error = new Error()
                error.statusCode = 400;
                error.reasons = ['User is not verified']
                throw error;
            }
        }catch(err){
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}