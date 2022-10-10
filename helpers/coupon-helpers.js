var db = require('../config/connection')
const collections = require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { Collection } = require('mongodb')


let objectId = require('mongodb').ObjectId


module.exports = {
    addCoupon: (coupon) => {
        return new Promise((resolve, reject) => {
        try {
          

                db.get().collection(collections.COUPON_COLLECTION).insertOne(coupon).then((response) => {
                    resolve(response)
                })
    
          
            
        } catch (error) {
            reject(error)
        }
    })
       


    },

    viewCoupon: () => {
        return new Promise(async (resolve, reject) => {
        try {
         
                let viewCoupon = await db.get().collection(collections.COUPON_COLLECTION).find().toArray()
                resolve(viewCoupon)
         
            
        } catch (error) {
            reject(error)
        }
       
    })
    },

    deleteCoupon: (couponId) => {
        return new Promise(async (resolve, reject) => {
        try {
         
                db.get().collection(collections.COUPON_COLLECTION).deleteOne({ _id: objectId(couponId) }).then((response) => {
                    resolve(response)
                })
        
            
        } catch (error) {
            reject(error)
        }
    })
    },


    getAllCoupon: (coupUSer) => {
        console.log(coupUSer, "coupDetailss");
        let couponNew = coupUSer.coupon;

        let userId = coupUSer.userId;
        console.log(userId);

        return new Promise(async (resolve, reject) => {
        try {
          
                let couponDetails = await db
                    .get()
                    .collection(collections.COUPON_COLLECTION)
                    .findOne({ coupon: couponNew });
    
                if (couponDetails) {
                    console.log(couponDetails, 'coupon detailsss');
                    var d = new Date();
                    console.log(d, 'dateeee onee');
                    let str = d.toJSON().slice(0, 10);
    
                    console.log(str, 'dateeeeee');
    
                    if (str > couponDetails.expiry) {
                        resolve({ expirry: true });
                    } else {
                        console.log('expiry ilaaaaaaaaaaaa');
                        console.log(couponDetails, 'coupon detailsssoneeeeee');
                        let users = await db
                            .get()
                            .collection(collections.COUPON_COLLECTION)
                            .findOne({ coupon: couponNew, users: { $in: [objectId(userId)] } });
                        console.log(users, 'user indoooooooooo');
                        if (users) {
                            console.log("users");
                            resolve({ used: true });
                        } else {
                            resolve(couponDetails);
                        }
                    }
                } else {
                    console.log("doesnt exist");
                    resolve({ unAvailable: true });
                }
          
            
        } catch (error) {
            reject(error)
        }
    });
       
    },

    addUser:  (orderDetails) => {
        console.log(orderDetails,'addddding userrrrrrrrrrrrrrrr');
        return new Promise((resolve, reject) => {

        try {
           
                db.get().collection(collections.COUPON_COLLECTION).updateOne({ coupon: orderDetails.coupon },
                {
                    $push: { users: orderDetails.userId }
    
                }).then((response) => {
                    resolve(response)
                })
    
        
         
        } catch (error) {
            reject(error)
        }
    })
       
    }



}