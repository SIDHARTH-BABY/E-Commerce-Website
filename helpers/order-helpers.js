var db = require('../config/connection')
var collection = require('../config/collections')
const collections = require('../config/collections')
const { response } = require('express')


let objectId = require('mongodb').ObjectId


module.exports = {
    placeOrder: (order, products, total,userId,discount,Couponname) => {
        console.log('haiiiii');
        console.log(userId,discount);
        let GrandTotal =total
        if(Couponname){
             GrandTotal =total - discount

        }
        
        return new Promise(async(resolve, reject) => {

            try {

                console.log(order, products, total);

                let status = await order['payment-method'] === 'COD' ? 'placed' : 'pending'
                let orderObj = {
                    deliveryDetails: {
                        email: order.email,
                        mobile: order.mobile,
                        address: order.address,
                        pincode: order.pincode,
                        name: order.name,
                        distirct: order.distirct,
                        Town: order.town,
                        state: order.state,

                    },
                    userId: objectId(order.userId),
                    paymentMethod: order['payment-method'],
                    products: products,
                    totalAmount: total,
                   
                    Discount :discount,
                    GrandTotal :GrandTotal,

                    couponDiscount: discount,

                    status: status,
                    date: new Date().toDateString()
                }
                let users = [objectId(userId)];
                await db
                    .get()
                    .collection(collection.COUPON_COLLECTION)
                    .updateOne({ coupon: Couponname }, { $set: { users } })
                await db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response) => {
                    db.get().collection('cart').deleteOne({ user: objectId(order.userId) })
                    console.log("orderID:", response.insertedId);
                    resolve(response.insertedId)
                })



            } catch (error) {
                console.log(error);
                reject(error)
            }

        })


    },

    getOrderDetails: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {

                orderDetails = await db.get().collection(collection.ORDER_COLLECTION).find({ userId: objectId(userId) }).toArray()
                resolve(orderDetails)



            } catch (error) {
                reject(error)
            }
        })


    },


    getSingleOrder: (orderId) => {
        return new Promise(async (resolve, reject) => {
            try {

                orderItems = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                    {
                        $match: { _id: objectId(orderId) }
                    },
                    {
                        $unwind: '$products'
                    },
                    {
                        $project: {
                            item: '$products.item',
                            quantity: '$products.quantity',
                            status: '$status',
                            date: '$date',
                            totalAmount: '$totalAmount',
                            value: '$value'

                        }
                    },
                    {
                        $lookup: {
                            from: 'water',
                            localField: 'item',
                            foreignField: '_id',
                            as: 'product'
                        }
                    },
                    {
                        $project: {
                            totalAmount: 1, status: 1, data: 1, value: 1, item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                        }
                    }

                ]).toArray()

                resolve(orderItems)



            } catch (error) {
                reject(error)
            }
        })

    },

    value: (orderId) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
            try {

                let order = await db.get().collection(collection.ORDER_COLLECTION).findOne({ _id: objectId(orderId) })
                console.log(order);
                console.log(order._id);
                if (order) {
                    if (order.value) {
                        response.status = true
                        response.id = order._id

                        resolve(response)
                    } else {
                        if (order.cancel) {

                        } else {
                            response.status = false
                            response.id = order._id
                            resolve(response)

                        }


                    }

                } else {
                    response.status = false
                    response.id = order._id
                    resolve(response)

                }



            } catch (error) {
                reject(error)
            }
        })
    },

    btnChange: (orderId) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
            try {

                let order = await db.get().collection(collection.ORDER_COLLECTION).findOne({ _id: objectId(orderId) })
                if (order) {
                    if (order.shipped) {
                        response.id = orderId
                        response.status = true
                        response.pack = false
                        resolve(response)
                    } else if (order.delivered) {
                        response.id = orderId
                        response.status = false
                        resolve(response)
                    } else {
                        response.pack = true
                        response.status = false
                        response.id = orderId
                        resolve(response)
                    }


                }



            } catch (error) {
                reject(error)
            }
        })

    },





    admingetOrder: () => {
        return new Promise(async (resolve, reject) => {
            try {

                let adminOrder = await db.get().collection(collections.ORDER_COLLECTION).find().toArray()

                resolve(adminOrder)



            } catch (error) {
                reject(error)
            }
        })

    },



    changeStatus: (orderId) => {
        return new Promise(async (resolve, reject) => {
            try {


                let changeOrderStatus = await db.get().collection(collections.ORDER_COLLECTION).updateOne({ _id: objectId(orderId) }, { $set: { status: 'packed', value: false, shipped: true, delivered: false } })
                resolve()


            } catch (error) {
                reject(error)
                
            }

        })



    },

    changeStatusShipped: (orderId) => {
        return new Promise(async (resolve, reject) => {
            try {

                let changeOrderStatus = await db.get().collection(collections.ORDER_COLLECTION).updateOne({ _id: objectId(orderId) }, { $set: { status: 'Shipped', value: false, shipped: false, delivered: true } })
                resolve()



            } catch (error) {
                reject(error)
            }
        });
    },

    changeStatusDelivered: (orderId) => {
        return new Promise(async (resolve, reject) => {
            try {

                let changeOrderStatus = await db.get().collection(collections.ORDER_COLLECTION).updateOne({ _id: objectId(orderId) }, { $set: { status: 'Delivered', value: true, shipped: false, delivered: true } })
                resolve()



            } catch (error) {
                reject(error)
            }
        });
    },

    changeStatusCancelled: (orderId) => {
        return new Promise(async (resolve, reject) => {
            try {

                let changeOrderStatus = await db.get().collection(collections.ORDER_COLLECTION).updateOne({ _id: objectId(orderId) }, { $set: { status: 'Order Cancelled', value: false } })
                resolve()


            } catch (error) {
                reject(error)
            }
        })

    },



    getGrandTotal: (orderId) => {
        return new Promise(async (resolve, reject) => {
            try {

                let totalAmount = await db.get().collection(collections.ORDER_COLLECTION).aggregate([
                    {
                        $match: { _id: objectId(orderId) }
                    },
                    {

                        $project: {
                            _id: 0,
                            grandTotal: [{ $toInt: '$grandTotal' }]
                        },
                    },


                ]).toArray()

                resolve(totalAmount[0])


            } catch (error) {
                reject(error)
            }

        })
    }


}

