var db = require('../config/connection')
const collections = require('../config/collections')
const bcrypt=require('bcrypt')
const { response } = require('express')


let objectId = require('mongodb').ObjectId

module.exports ={
    doSignUp:(userData)=>{
        
        return new Promise(async(resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10);
            db.get().collection('shop').insertOne(userData).then((data)=>{
                resolve(data)
               
            })
        })
    },

    doLogin:(userData)=>{
        console.log(userData);
      
        return new Promise(async(resolve,reject)=>{
        var loginStatus = false
        let response={}
        var user = await db.get().collection('shop').findOne({Email:userData.Email})
       

        if(user){
            if(user.block){
                console.log("login failed blocked");

                
                response.status=false
            
                 resolve(response)

            }else{
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log("login success");
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log("login failed");
                        resolve({status:false})
                    }
                })

            }
            
        }else{
            console.log("login failed");
            resolve({status:false})
        }

    })


},

getAllUsers:()=>{
    return new Promise((resolve, reject) =>{
        let userdetails=db.get().collection('shop').find().toArray()
        resolve(userdetails)
    })
},     


blockUser:(userId)=>{
    return new Promise((resolve, reject)=>{
        db.get().collection('shop').updateOne({_id:objectId(userId)},{$set:{block:true}}).then(()=>{
            resolve()
        })
    })
},

activeUser:(userId)=>{
    return new Promise((resolve, reject)=>{
        db.get().collection('shop').updateOne({_id:objectId(userId)},{$set:{block:false}}).then(()=>{
            resolve()
    })
})
},

verifyUser:(userData)=>{
    let response={}
    return new Promise(async(resolve, reject)=>{
        let verify = await db.get().collection('shop').findOne({Email:userData.Email})

        if(verify){
            response.status= false
            resolve(response)
        }else{
            response.status=true
            resolve(response)
        }

    })
},




 

}


// {
            //     $lookup: {
            //         from : 'water',
            //         let: {proList : '$product'},
            //         pipeline:[

            //             {

            //                 $match:{
            //                     $expr:{
            //                         $in:['$_id','$$proList']
            //                     }

            //                 }
            //             }
                            

            //         ],
            //         as:'cartItems'


            //     }
            // }