var db = require('../config/connection')
const collections = require('../config/collections')
const { response } = require('express')
let objectId = require('mongodb').ObjectId




module.exports={

    addbanner:(banner,callback)=>{

        try {
            db.get().collection(collections.BANNER_COLLECTION).insertOne(banner).then((data)=>{
                callback(data.insertedId)
            })
            
        } catch (error) {
            reject(error)
        }
      
          
      
    },

    viewBanner:(banner)=>{
        return new Promise(async(resolve, reject) => {
        try {
        
                let banner = await db.get().collection(collections.BANNER_COLLECTION).find().toArray()
                 resolve(banner)
          
            
        } catch (error) {
            reject(error)
        }
    })
    },

    deleteBanner: (bannerId)=>{
        return new Promise(async (resolve, reject) => {
        try {
            
         
                db.get().collection(collections.BANNER_COLLECTION).deleteOne({ _id: objectId(bannerId) }).then((response) => {
                  resolve(response)
          
          
                })
           
            
        } catch (error) {
            reject(error)
        }
    })

       

    }

}