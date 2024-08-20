import crypto from 'crypto';

function generateOTP() {
    const otp = crypto.randomInt(0, 1000000); 
    return otp.toString().padStart(6, '0');   
  }

export default generateOTP