const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER
import twilio from 'twilio'

const sendMobile = async (otp,recieverNumber)=>{
    const client = new twilio(accountSid, authToken);
    client.messages
        .create({
            body: `RollIN OTP Verification code is ${otp}`,
            from: twilioNumber,
            to: `+91${recieverNumber}`
        })
        .then(message => 
            console.log(message.sid)
        )

}


export default sendMobile