var db = require('../config/connection')
const collections = require('../config/collections')
const bcrypt=require('bcrypt')
const { response } = require('express')
const { Collection } = require('mongodb')


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


profileDetails: (addressData,userId) => {
        create_random_id(15)
        function create_random_id(string_Length) {
            var randomString = ''
            var numbers = '1234567890'
            for (var i = 0; i < string_Length; i++) {
                randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
            }
            addressData._addId = "ADD" + randomString
        }
        let subAddress = {
            _addId: addressData._addId,
            Name: addressData.Name,
            Building_Name: addressData.Building_Name,
            Street_Name: addressData.Street_Name,
            City: addressData.City,
            District: addressData.District,
            Pincode: addressData.Pincode,
            Country: addressData.Country,
            State: addressData.State
        }
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collections.USER_collection).findOne({ _id: objectId(userId) })

            if (user.Addresses) {
                if (user.Addresses.length < 4) {
                    db.get().collection(collections.USER_collection).updateOne({ _id: objectId(userId) }, {
                        $push: { Addresses: subAddress }
                    }).then(() => {
                        resolve()
                    })
                } else {
                    resolve({ full: true })
                }

            } else {
                Addresses = [subAddress]
                db.get().collection(collections.USER_collection).updateOne({ _id: objectId(userId) }, { $set: { Addresses } }).then(() => {
                    resolve()
                })
            }
        })
},



getUserDetails:(userId)=>{
    return new Promise((resolve,reject) => {
        userSignupDetails = db.get().collection(collections.USER_collection).findOne({_id:objectId(userId)})
        resolve(userSignupDetails)
    })
},

updateUsername:(userId,userName)=>{
    return new Promise((resolve,reject) => {
        db.get().collection('shop').updateOne({_id:objectId(userId)},{$set:{Name:userName.Name}}).then(()=>{
            resolve()
        });

    })
},


userAddress:(userId)=>{
    return new Promise((resolve,reject) => {
        let address= db.get().collection(collections.USER_collection).aggregate([
            {
                $match: { _id: objectId(userId) }
            },
            {
                $unwind:'$Addresses'
            },
            {
                $project: {
                    id:'$Addresses._addId',
                    name:'$Addresses.Name',
                    city:'$Addresses.City',
                    pincode:'$Addresses.Pincode',
                    district:'$Addresses.District',
                    state:'$Addresses.State',
                    country:'$Addresses.Country',
                    building:'$Addresses.Building_Name',
                    street:'$Addresses.Street_Name'
               
                }

            }

        ]).toArray()
        resolve(address)
    })

},

deleteAddress:(addressId,userId)=>{
    
    return new Promise((resolve, reject) =>{
        db.get().collection(collections.USER_collection).updateOne({ _id: objectId(userId) },
        {
            $pull: { Addresses: { _addId : addressId } }
        }
    ).then((response) =>{
        resolve(response)
    })
    })
},

updateUserPassword:(userId,userPassword)=>{
    console.log(userPassword);
   
    return new Promise(async(resolve, reject) =>{
        
        userPassword.PasswordOne=await bcrypt.hash(userPassword.PasswordOne,10);
       
        db.get().collection(collections.USER_collection).updateOne({_id:objectId(userId)},{$set:{Password:userPassword.PasswordOne}}).then((data)=>{
          
            resolve(data)

    })
})




},


// editAddress:(userId,address,addressId)=>{
//     return new Promise((resolve, reject)=>{
// db.get().collection(collections.USER_collection).updateOne({ _id: objectId(userId), 'Addresses.$._addId':addressId},
    
//     {
//         $set:{
//            ' Addresses.$.Name':address.Name,
//           ' Addresses.$.Building_Name':address.Building,
//           ' Addresses.$.Street_Name':address.Street,  
//           ' Addresses.$.City':address.City,
//            'Addresses.$. District':address.District,
//           ' Addresses.$.Pincode': address.Pincode,
//            'Addresses.$.country':address.Country,
//           ' Addresses.$.state':address.State  

//         }
//     }
// ).then((response)=>{
//     resolve(response)
// })
    
  

    
// })

// }


editAddress:(userId,address,addressId)=>{
    console.log(userId);
    console.log(address);
    console.log(addressId);
    return new Promise((resolve, reject)=>{
db.get().collection(collections.USER_collection).updateOne({ _id: objectId(userId), 'Addresses._addId':addressId},

   
    {
        $set:{

                       "Addresses.$.Name" :address.Name,
                      "Addresses.$.Building_Name":address.Building,
                      "Addresses.$.Street_Name":address.Street,  
                      "Addresses.$.City":address.City,
                       "Addresses.$. District":address.District,
                       "Addresses.$.country":address.Country,
                      " Addresses.$.state":address.State  

          }
    }
).then((response)=>{
        resolve(response)
    })
  
})


}
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


