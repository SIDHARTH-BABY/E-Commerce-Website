var db = require('../config/connection')
var collection = require('../config/collections')

let objectId = require('mongodb').ObjectId


module.exports={
    addProduct :(product,callback)=>{
    
        db.get().collection('water').insertOne(product).then((data)=>{
       
            // console.log(data);
           
       
          callback(data.insertedId)
        })
    },
    
getAllProduct:()=>{
      return new  Promise(async(resolve,reject)=>{
         let products = await db.get().collection('water').find().toArray()
              resolve(products)
          })
},

deleteProduct:(prodId)=>{
     return new Promise(async(resolve,reject)=>{
      console.log(prodId);
      console.log(objectId(prodId));
      db.get().collection('water').deleteOne({_id:objectId(prodId)}).then((response)=>{
        resolve(response)

      
     })
    })
},
getProductDetails:(proId)=>{
  return new Promise((resolve,reject)=>{
   db.get().collection('water').findOne({_id:objectId(proId)}).then((product)=>{
    resolve(product)
   })
  })
},
     
updateProduct:(proId,proDetails)=>{
  return new Promise((resolve,reject)=>{
    db.get().collection('water')
    .updateOne({_id:objectId(proId)},{
      $set:{
        
        name:proDetails.name,
        description:proDetails.description,
        price:proDetails.price,

      }
    }).then((response)=>{
      resolve()
    })
  })
},

catProMatch:(catId)=>{

  try {
    return new Promise((resolve,reject)=>{
      let product = db.get().collection('water').find({Category:catId}).toArray()
        resolve(product)
  
    })
    
  } catch (error) {

    throw new Error(error)

  }
  
}

}