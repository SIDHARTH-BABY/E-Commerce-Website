var db = require('../config/connection')
var collection = require('../config/collections')

let objectId = require('mongodb').ObjectId



module.exports = {
  insertCategory: (proDetails) => {
    return new Promise((resolve, reject) => {
    try {
     
        db.get().collection('cat').insertOne(proDetails).then((data) => {
          console.log(data);
          resolve(data)

        })
  

    } catch (error) {
      reject(error)
    }

  })

  },

  viewCategory: () => {
    return new Promise(async (resolve, reject) => {
    try {
     
        let category = await db.get().collection('cat').find().toArray()


        resolve(category)

    

    } catch (error) {
      reject(error)
    }
  })

  },

  deleteCategory: (catDetails) => {
    return new Promise((resolve, reject) => {
    try {
      

        db.get().collection('cat').deleteOne({ _id: objectId(catDetails) }).then((response) => {
          resolve(response)

        })
    

    } catch (error) {
      reject(error)
    }
  })

  },
 


}