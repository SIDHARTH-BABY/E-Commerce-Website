var db = require('../config/connection')
const collections = require('../config/collections')
const { response } = require('express')
let objectId = require('mongodb').ObjectId

module.exports={

    addToCart:(userId,proId)=>{

        let proObj ={
            item : objectId(proId),
            quantity :1
        }
    
        return new Promise(async(resolve,reject)=>{
            let userCart= await db.get().collection('cart').findOne({user:objectId(userId)})
    
            if(userCart){
                let proExist = userCart.product.findIndex(prod=>prod.item==proId)
                console.log(proExist);
                if(proExist!=-1){
                    db.get().collection('cart').updateOne({user:objectId(userId),'product.item':objectId(proId)},
                    {
                        $inc:{'product.$.quantity':1}
                    }
                    ).then(()=>{
                        resolve()
     
                    })
                      
                }else{
                    db.get().collection('cart').updateOne({user:objectId(userId)},
                    {
                        $push:{ product:proObj}
                        
                    }).then((response)=>{
                        resolve(response)
                    })
    
                }
    
            
            }else{
                let cartObj={
                    user:objectId(userId),
                    product:[proObj]
                }
                db.get().collection('cart').insertOne(cartObj).then((response)=>{
                    resolve(response)
                })
            }
    
        })
    
    },
    

    getCartProduct:(userId)=>{
    
        
        return new Promise(async(resolve,reject)=>{
            let cartItems= await db.get().collection('cart').aggregate([
                {
                    $match:{user:objectId(userId)}
    
                }, 
                {
                    $unwind:'$product'
                },
                {
                    $project:{
                        item:'$product.item',
                        quantity:'$product.quantity'
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
           
           
            resolve(cartItems)
        })
    },
    
    getCartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let count = 0
            
            let cart = await db.get().collection('cart').findOne({user:objectId(userId)})
            if (cart){
                count = cart.product.length
    
            }
            resolve (count)
    
        })
    
    }, 
    changeProductQuantity:(details)=>{
    
        details.count=parseInt(details.count)
        details.quantity=parseInt(details.quantity)
    
       return new Promise(((resolve,reject)=>{
        if(details.count==-1 && details.quantity==1){
            db.get().collection('cart').updateOne({_id:objectId(details.cart)},
            {
                $pull:{product:{item:objectId(details.product)}}
            }
       ).then((response)=>{

        resolve({removeProduct:true})

       })

        }else{
            db.get().collection('cart').updateOne({_id:objectId(details.cart),'product.item':objectId(details.product)},
                    {
                        $inc:{'product.$.quantity':details.count}
                    }
                    ).then((response)=>{
                        console.log(response);
                        resolve({status:true})
    
                    })
        }
        
       }))
    },

    deleteProduct:(proDetails)=>{
        console.log('iiiiiiiiiiiiiiiiiiiiiiiiiii');
        console.log(proDetails);
        return new Promise((resolve, reject)=>{
            db.get().collection('cart').updateOne({_id:objectId(proDetails.cart)},
            {
                $pull:{product:{item:objectId(proDetails.product)}}
            }
            ).then((respsone)=>{

                resolve({removePro:true})

            }).catch(function () {

                console.log('Some error has occurred');

            })

        })

    },

    getTotalAmount:(userId)=>{
        console.log(userId+"ooooooooooooooooooooooooooo");
        return new Promise(async(resolve,reject)=>{
            let total= await db.get().collection('cart').aggregate([
                {
                    $match:{user:objectId(userId)}
    
                }, 
                {
                    $unwind:'$product'
                },
                {
                    $project:{
                        item:'$product.item',
                        quantity:'$product.quantity'
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
                },
                {
                    $group:{
                        _id:null,
                        total:{$sum:{$multiply:['$quantity',{$toInt:'$product.price'}]}}
                    }
                }
    
    
            ]).toArray()
            
            console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu');
           
           if(total.length==0){
            resolve(total)
           }else{
            resolve(total[0].total)

           }
           
           
           
        }) 

    },

    getCartProductList:(userId)=>{
        return new Promise(async(resolve, reject) => {
            let cart =await db.get().collection('cart').findOne({user:objectId(userId)})
            resolve(cart.product)
        })

    }




    


}


