var db = require('../config/connection')
var collection = require('../config/collections')

let objectId = require('mongodb').ObjectId



module.exports={
    insertCategory:(proDetails)=>{
        return new Promise((resolve,reject)=>{
          db.get().collection('cat').insertOne(proDetails).then((data)=>{
            resolve(data)
      
          })
        })
      
      },

      viewCategory:()=>{
        return new Promise(async(resolve,reject)=>{
            let category=await db.get().collection('cat').find().toArray()
            resolve(category)

        })
    },

    deleteCategory:(catDetails)=>{
        return new Promise((resolve,reject)=>{
            
            db.get().collection('cat').deleteOne({_id:objectId(catDetails)}).then((response)=>{
                resolve(response)

        })
    })
      
  },
  // getCategoryDetails:(catId)=>{
  //   return new Promise((resolve,reject)=>{
  //    db.get().collection('water').findOne({_id:objectId(proId)}).then((product)=>{
  //     resolve(product)
  //    })
  //   })
  // }

  
}