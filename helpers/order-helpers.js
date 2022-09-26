var db = require('../config/connection')
var collection = require('../config/collections')


let objectId = require('mongodb').ObjectId


module.exports={
    placeOrder:(order,products,total)=>{

        return new Promise((resolve, reject) => {
           console.log(order,products,total);

           let status=order['payment-method']==='COD'?'placed':'pending'
           let orderObj={
            deliveryDetails:{
                email:order.email,
                mobile:order.mobile,
                address:order.address,
                pincode:order.pincode,
                name:order.name,
                distirct:order.distirct,
                Town:order.town,
                state: order.state,



            },
            userId:objectId(order.userId),
            paymentMethod:order['payment-method'],
            products:products,
            totalAmount:total,
            status:status,
            date: new Date()
           }
           db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
           db.get().collection('cart').deleteOne({user:objectId(order.userId)}) 
            resolve(response)
           })

        })
    
    },

    getOrderDetails:(userId)=>{

        return new Promise(async(resolve,reject)=>{
            orderDetails=await db.get().collection(collection.ORDER_COLLECTION).find({userId:objectId(userId)}).toArray()
            resolve(orderDetails)

        })

    },


    getSingleOrder:(orderId)=>{
        return new Promise(async(resolve,reject)=>{
            orderItems=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $match:{_id:objectId(orderId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity',

                    }
                },
                {
                    $lookup:{
                        from:'water',
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                    }
                }

            ]).toArray()

            resolve(orderItems)

        })

    }
}

