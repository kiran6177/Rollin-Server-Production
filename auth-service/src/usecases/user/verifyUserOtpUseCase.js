import { AwsConfig } from "../../utils/aws-s3.js";
import { createRefreshToken, createToken } from "../../utils/jwt.js";
const USER_OWNER = 'user'

export class VerifyUserOtp{
    constructor(dependencies){
        this.userRepository = new dependencies.Repositories.MongoUserRepository()
        this.awsConfig = new AwsConfig()
    }

    async execute(id,otp,sessionOTP){
        try {
            const userExist = await this.userRepository.findUserById(id);
            console.log(userExist);
            if(userExist){
                if(sessionOTP){
                    if(parseInt(sessionOTP) === otp){
                        let image
                        if(userExist.image){
                             image = await this.awsConfig.getImage(userExist.image,USER_OWNER)
                        }
                        const userWOP = {
                            id:userExist._id,
                            email:userExist.email,
                            mobile:userExist.mobile,
                            firstname:userExist.firstname,
                            lastname:userExist.lastname,
                            image,
                            authtype:userExist.type,
                            address:userExist.address,
                            walletBalance:userExist.walletBalance,
                        }

                        const accessToken = await createToken({...userWOP,role:'USER'});
                        const refreshToken = await createRefreshToken({id:userWOP.id,role:'USER'})

                        return {
                            data :userWOP,
                            accessToken,
                            refreshToken
                        }
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