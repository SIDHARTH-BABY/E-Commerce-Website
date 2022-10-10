var db = require('../config/connection')
const collections = require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { Collection } = require('mongodb')


let objectId = require('mongodb').ObjectId

module.exports = {
    doSignUp: (userData) => {
        return new Promise(async (resolve, reject) => {

        try {
          
                userData.Password = await bcrypt.hash(userData.Password, 10);
                db.get().collection('shop').insertOne(userData).then((data) => {
                    resolve(data)

                })
        

        } catch (error) {
            reject(error)
        }

    })
    },

    doLogin: (userData) => {
        console.log(userData);

        return new Promise(async (resolve, reject) => {
        try {
           
                var loginStatus = false
                let response = {}
                var user = await db.get().collection('shop').findOne({ Email: userData.Email })


                if (user) {
                    if (user.block) {
                        console.log("login failed blocked");


                        response.status = false

                        resolve(response)

                    } else {
                        bcrypt.compare(userData.Password, user.Password).then((status) => {
                            if (status) {
                                console.log("login success");
                                response.user = user
                                response.status = true
                                resolve(response)
                            } else {
                                console.log("login failed");
                                resolve({ status: false })
                            }
                        })

                    }

                } else {
                    console.log("login failed");
                    resolve({ status: false })
                }

           

        } catch (error) {
            reject(error)
        }
    })


    },

    getAllUsers: () => {
        return new Promise((resolve, reject) => {
        try {
          
                let userdetails = db.get().collection('shop').find().toArray()
                resolve(userdetails)
         
        } catch (error) {
            reject(error)
        }
    })
    },


    blockUser: (userId) => {
        return new Promise((resolve, reject) => {
        try {
          
                db.get().collection('shop').updateOne({ _id: objectId(userId) }, { $set: { block: true } }).then(() => {
                    resolve()
                })
       

        } catch (error) {
            reject(error)
        }
    })
    },

    activeUser: (userId) => {
        return new Promise((resolve, reject) => {
        try {
           
                db.get().collection('shop').updateOne({ _id: objectId(userId) }, { $set: { block: false } }).then(() => {
                    resolve()
                })
          

        } catch (error) {
            reject(error)
        }
    })
    },

    verifyUser: (userData) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
        try {
          
                let verify = await db.get().collection('shop').findOne({ Email: userData.Email })

                if (verify) {
                    response.status = false
                    resolve(response)
                } else {
                    response.status = true
                    resolve(response)
                }

        

        } catch (error) {
            reject(error)
        }
    })
    },


    profileDetails: (addressData, userId) => {
        try {
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
                Email: addressData.Email,
                mobile: addressData.mobile,
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

        } catch (error) {
            reject(error)
        }

    },



    getUserDetails: (userId) => {
        return new Promise((resolve, reject) => {
        try {
           
                userSignupDetails = db.get().collection(collections.USER_collection).findOne({ _id: objectId(userId) })
                resolve(userSignupDetails)
         

        } catch (error) {
            reject(error)
        }
    })

    },

    updateUsername: (userId, userName) => {
        return new Promise((resolve, reject) => {
        try {
           
                db.get().collection('shop').updateOne({ _id: objectId(userId) }, { $set: { Name: userName.Name } }).then(() => {
                    resolve()
                });

        

        } catch (error) {
            reject(error)
        }
    })

    },


    userAddress: (userId) => {
        return new Promise((resolve, reject) => {
        try {
           
                let address = db.get().collection(collections.USER_collection).aggregate([
                    {
                        $match: { _id: objectId(userId) }
                    },
                    {
                        $unwind: '$Addresses'
                    },
                    {
                        $project: {
                            id: '$Addresses._addId',
                            name: '$Addresses.Name',
                            mobile: '$Addresses.mobile',
                            Email: '$Addresses.Email',
                            city: '$Addresses.City',
                            pincode: '$Addresses.Pincode',
                            district: '$Addresses.District',
                            state: '$Addresses.State',
                            country: '$Addresses.Country',
                            building: '$Addresses.Building_Name',
                            street: '$Addresses.Street_Name'

                        }

                    }

                ]).toArray()
                resolve(address)
         

        } catch (error) {
            reject(error)
        }
    })


    },

    deleteAddress: (addressId, userId) => {
        return new Promise((resolve, reject) => {
        try {
          
                db.get().collection(collections.USER_collection).updateOne({ _id: objectId(userId) },
                    {
                        $pull: { Addresses: { _addId: addressId } }
                    }
                ).then((response) => {
                    resolve(response)
                })
        

        } catch (error) {
            reject(error)
        }

    })
    },

    updateUserPassword: (userId, userPassword) => {
        return new Promise(async (resolve, reject) => {
        try {


        

          

                userPassword.PasswordOne = await bcrypt.hash(userPassword.PasswordOne, 10);

                db.get().collection(collections.USER_collection).updateOne({ _id: objectId(userId) }, { $set: { Password: userPassword.PasswordOne } }).then((data) => {

                    resolve(data)

                })
           

        } catch (error) {
            reject(error)
        }

    })
    },







    editAddress: (userId, address, addressId) => {
        return new Promise((resolve, reject) => {
        try {
       
                db.get().collection(collections.USER_collection).updateOne({ _id: objectId(userId), 'Addresses._addId': addressId },


                    {
                        $set: {

                            "Addresses.$.Name": address.Name,
                            "Addresses.$.Email": address.Email,
                            "Addresses.$.Building_Name": address.Building,
                            "Addresses.$.Street_Name": address.Street,
                            "Addresses.$.City": address.City,
                            "Addresses.$. District": address.District,
                            "Addresses.$.Country": address.Country,
                            "Addresses.$.State": address.State

                        }
                    }
                ).then((response) => {
                    resolve(response)
                })

        
        } catch (error) {
            reject(error)
        }
    })




    },



    



    placeAddress: (addressId, userId) => {
        return new Promise(async (resolve, reject) => {
        try {
           
                let address = await db.get().collection(collections.USER_collection).aggregate([
                    {
                        $match: { _id: objectId(userId) }
                    },
                    {
                        $unwind: '$Addresses'
                    },
                    {
                        $match: { 'Addresses._addId': addressId }
                    },
                    {
                        $project: {
                            id: '$Addresses._addId',
                            name: '$Addresses.Name',
                            Email: '$Addresses.Email',
                            mobile: '$Addresses.mobile',
                            city: '$Addresses.City',
                            pincode: '$Addresses.Pincode',
                            district: '$Addresses.District',
                            state: '$Addresses.State',
                            country: '$Addresses.Country',
                            building: '$Addresses.Building_Name',
                            street: '$Addresses.Street_Name'

                        }

                    }

                ]).toArray()
                resolve(address[0])
                console.log(address[0]);
          

        } catch (error) {
            reject(error)
        }

    })
    },


}