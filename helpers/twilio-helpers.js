



const client = require('twilio')('AC380e7cb3053aaa933849f8ce812f1d25','2ba2ebe3a3bfad03f62531c7f6e50d5d');  
const serviceSid = 'VAf7edb97afe289dda1a0df1aee1ebb495'        

module.exports={
   
    doSms:(userData)=>{
        
        return new Promise(async(resolve,reject)=>{
            let res={}
            console.log(userData);
            console.log('eeeeeeeeeeeeeeee');
            await client.verify.services(serviceSid).verifications.create({
               
                to :`+91${userData.phone}`,
                channel:"sms"
            }).then((reeee)=>{
                res.valid=true;
               resolve(res)
                console.log(reeee);
            }).catch((err)=>{
                console.log('kkkkkkkkkkkkkkkk');
                console.log(err);

            })
        })
    },
   
    otpVerify:(otpData,userData)=>{
        console.log(otpData);
        console.log(userData);
       

        return new Promise(async(resolve,reject)=>{
            await client.verify.services(serviceSid).verificationChecks.create({
                to :`+91${userData.phone}`,
                code:otpData.otp
            }).then((verifications)=>{
                 console.log(verifications);
                resolve(verifications.valid)
            })
        })
    }

   

 }
