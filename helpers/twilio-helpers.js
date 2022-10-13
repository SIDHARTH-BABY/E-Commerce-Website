
const dotenv = require('dotenv')
dotenv.config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const ServiceSID = process.env.TWILIO_Service_SID;
const client = require('twilio')(accountSid,authToken,ServiceSID);


// const client = require('twilio')('AC4dd774091e1a4d8e6b062e9922b3fd62', '025e348e439499b502ee9ea1642506f1');
// const serviceSid = 'VAcce36d37344c813949b71aa1407f8db1'

module.exports = {

    doSms: (userData) => {
        return new Promise(async (resolve, reject) => {
        try {
           
                let res = {}
                console.log(userData);
                console.log('eeeeeeeeeeeeeeee');
                await client.verify.services( ServiceSID).verifications.create({
    
                    to: `+91${userData.phone}`,
                    channel: "sms"
                }).then((reeee) => {
                    res.valid = true;
                    resolve(res)
                    console.log(reeee);
                }).catch((err) => {
    
                    console.log(err);
    
                })
        
            
        } catch (error) {
            reject(error)
        }

    })
    },

    otpVerify: (otpData, userData) => {
        console.log(otpData);
        console.log(userData);


        return new Promise(async (resolve, reject) => {
        try {
           
                await client.verify.services( ServiceSID).verificationChecks.create({
                    to: `+91${userData.phone}`,
                    code: otpData.otp
                }).then((verifications) => {
                    console.log(verifications);
                    resolve(verifications.valid)
                })
          
            
        } catch (error) {
            reject(error)
        }
    })
      
    }



}
