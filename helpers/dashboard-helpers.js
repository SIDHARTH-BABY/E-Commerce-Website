var db = require('../config/connection')
const collections = require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { Collection } = require('mongodb')


let objectId = require('mongodb').ObjectId








module.exports = {
    getUserCount: (req, res) => {
        return new Promise(async (resolve, reject) => {
        try {
           


                let user = await db.get().collection(collections.USER_collection).find().count()

                resolve(user)
          

        } catch (error) {

        }

    })
    },

    getOrderCount: (req, res) => {
        return new Promise(async (resolve, reject) => {
        try {
          


                let order = await db.get().collection(collections.ORDER_COLLECTION).find().count()

                resolve(order)
         

        } catch (error) {

        }
    })

    },
    totalCOD: () => {
        return new Promise(async (resolve, reject) => {
        try {
           

                let count = await db.get().collection(collections.ORDER_COLLECTION).find({ paymentMethod: "COD", }).count()
                resolve(count)

         

        } catch (error) {

        }
    })
    },
    totalONLINE: () => {
        return new Promise(async (resolve, reject) => {
        try {
         

                let onlineCount = await db.get().collection(collections.ORDER_COLLECTION).find({ paymentMethod: "ONLINE", }).count()
                resolve(onlineCount)

       

        } catch (error) {

        }
    })

    },



    totalDelivered: () => {
        return new Promise(async (resolve, reject) => {
        try {
          

                let totalDeliveredCount = await db.get().collection(collections.ORDER_COLLECTION).find({ status: "Delivered" }).count()
                resolve(totalDeliveredCount)

         

        } catch (error) {

        }
    })
    },


    totalShipped: () => {
        return new Promise(async (resolve, reject) => {
        try {
         

                let totalDeliveredShipped = await db.get().collection(collections.ORDER_COLLECTION).find({ status: "Shipped" }).count()
                resolve(totalDeliveredShipped)

         

        } catch (error) {

        }
    })
    },

    cancelled: () => {
        return new Promise(async (resolve, reject) => {
        try {
        

                let cancelled = await db.get().collection(collections.ORDER_COLLECTION).find({ status: "Order Cancelled" }).count()
                resolve(cancelled)

          

        } catch (error) {

        }
    })
    },

    totalMonthAmount: () => {
        return new Promise(async (resolve, reject) => {
        try {
          
                var date = new Date()

                let amount = await db.get().collection(collections.ORDER_COLLECTION).aggregate([


                    {
                        $setWindowFields: {

                            sortBy: { date: 1 },

                            output: {
                                Tamount: {
                                    $sum: "$totalAmount",

                                }
                            }
                        }

                    },
                    {

                        $project: {
                            Tamount: 1
                        }

                    }

                ]).toArray()
                resolve(amount[0])

        

        } catch (error) {

        }
    })


    }

}