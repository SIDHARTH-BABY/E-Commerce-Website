var db = require('../config/connection')
var collection = require('../config/collections')

let objectId = require('mongodb').ObjectId


module.exports = {
  addProduct: (product, callback) => {

    try {
      db.get().collection('water').insertOne(product).then((data) => {

        // console.log(data);


        callback(data.insertedId)
      })

    } catch (error) {
      reject(error)
    }


  },

  getAllProduct: () => {
    return new Promise(async (resolve, reject) => {
      try {

        let products = await db.get().collection('water').find().toArray()
        resolve(products)


      } catch (error) {
        reject(error)
      }
    })
  },

  deleteProduct: (prodId) => {
    return new Promise(async (resolve, reject) => {
      try {

        console.log(prodId);
        console.log(objectId(prodId));
        db.get().collection('water').deleteOne({ _id: objectId(prodId) }).then((response) => {
          resolve(response)


        })


      } catch (error) {
        reject(error)
      }
    })

  },
  getProductDetails: (proId) => {
    return new Promise((resolve, reject) => {
      try {

        db.get().collection('water').findOne({ _id: objectId(proId) }).then((product) => {
          resolve(product)
        })


      } catch (error) {
        reject(error)
      }
    })

  },

  updateProduct: (proId, proDetails) => {
    return new Promise((resolve, reject) => {
      try {

        db.get().collection('water')
          .updateOne({ _id: objectId(proId) }, {
            $set: {

              name: proDetails.name,
              description: proDetails.description,
              price: proDetails.price,

            }
          }).then((response) => {
            resolve()
          })


      } catch (error) {
        reject(error)
      }
    })

  },

  catProMatch: (catId) => {
    return new Promise((resolve, reject) => {
      try {

        let product = db.get().collection('water').find({ Category: catId }).toArray()
        resolve(product)



      } catch (error) {

        throw new Error(error)

      }
    })
  },



}