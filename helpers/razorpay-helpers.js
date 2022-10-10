var db = require('../config/connection')
const collections = require('../config/collections')
const bcrypt=require('bcrypt')
const { response } = require('express')
const { Collection, ObjectId } = require('mongodb')
const Razorpay = require('razorpay')

var instance = new Razorpay({
    key_id: 'rzp_test_OsmjfmpnYOiWtv',
    key_secret: '12mtfQFOv31sIJ6mOSF2DvqK',
  });


module.exports = {

    generateRazorpay :(orderId,grandTotal)=>{
        return new Promise((resolve, reject) => {
        try {
        

                var options={
                    amount:grandTotal*100,
                    currency:"INR",
                    receipt: ""+orderId
    
    
                        }
    
                        instance.orders.create(options,function(err,order){
                            if(err){
                                console.log(err);
                            }else{
                            console.log("new order :",order);
                            resolve(order);
                            }
                        })
    
               
         
            
        } catch (error) {
            reject(error)
        }
    })
     
        
    },

    verifyPayment:(details)=>{

        return new Promise((resolve, reject) => {
        try {
        
                const  crypto = require('crypto');
                let hmac = crypto.createHmac('sha256','12mtfQFOv31sIJ6mOSF2DvqK')
                hmac.update (details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]'])
                hmac=hmac.digest('hex')
                if(hmac==details['payment[razorpay_signature]']){
                    resolve()
                }else{
                    reject()
                }
          
            
        } catch (error) {
            reject(error)
        }
    });
 
    },



    changePaymentStatus:(orderId)=>{
        return new Promise((resolve, reject) => {
        try {
          
                db.get().collection(collections.ORDER_COLLECTION).updateOne({_id:ObjectId(orderId)},
                {
                    $set:{
                        status:'placed'
                    }
                },
                ).then(()=>{
                    resolve()
                })
          
            
        } catch (error) {
            reject(error)
        }
    })
       

    }

}

