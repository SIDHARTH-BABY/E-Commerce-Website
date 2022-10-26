const { response, request } = require('express');
const express = require('express');
const router = express.Router();
const userHelpers = require('../helpers/user-helpers');
const productHelpers = require('../helpers/product-helpers');
const twilioHelpers = require('../helpers/twilio-helpers');
const categoryHelpers = require('../helpers/category-helpers');
const cartHelpers = require('../helpers/cart-helpers');
const orderHelpers = require('../helpers/order-helpers');
const razorpayHelpers = require('../helpers/razorpay-helpers');
const couponHelpers = require('../helpers/coupon-helpers');




module.exports = {

  user_home: async (req, res, next) => {
    try {
      let cartCount = null

      if (req.session.loggedIn) {

        let user = req.session.user

        cartCount = await cartHelpers.getCartCount(req.session.user._id)

        let viewCoupon = await couponHelpers.viewCoupon()

        products = await productHelpers.getAllProduct()

        catdetails = await categoryHelpers.viewCategory()

        res.render('user/user-home', { layout: 'user-layout', userq: true, products, user, catdetails, cartCount, viewCoupon })

      } else {
        products = await productHelpers.getAllProduct()

        catdetails = await categoryHelpers.viewCategory()

        res.render('user/user-home', { layout: 'user-layout', userq: true, products, catdetails })

      }

    } catch (error) {

      next(error)
    }

  },

  category_product: async (req, res, next) => {
    try {
      if (req.session.loggedIn) {
        let user = req.session.user
        cartCount = await cartHelpers.getCartCount(req.session.user._id)
        catdetails = await categoryHelpers.viewCategory()


        let catId = req.query.category

        console.log(catId);


        productHelpers.catProMatch(catId).then((products) => {
          console.log(products);
          res.render('user/user-category', { layout: 'user-layout', userq: true, products, user, catdetails, cartCount })
        }).catch((err) => {

          res.render('user/user-category', { err })

        })

      } else {
        catdetails = await categoryHelpers.viewCategory()


        let catId = req.query.category




        productHelpers.catProMatch(catId).then((products) => {

          res.render('user/user-category', { layout: 'user-layout', userq: true, products, catdetails })
        }).catch((err) => {

          res.render('user/user-category', { err })

        })

      }


    } catch (error) {
      next(error)
    }



  },


  user_menu: async (req, res, next) => {
    try {
      if (req.session.loggedIn) {
        let user = req.session.user
        cartCount = await cartHelpers.getCartCount(req.session.user._id)
        catdetails = await categoryHelpers.viewCategory()
        productHelpers.getAllProduct().then((products) => {
          res.render('user/user-menu', { layout: 'user-layout', userq: true, products, user, catdetails, cartCount })
        })
      } else {
        productHelpers.getAllProduct().then(async (products) => {
          catdetails = await categoryHelpers.viewCategory()
          res.render('user/user-menu', { layout: 'user-layout', userq: true, products, catdetails })
        })
      }

    } catch (error) {
      next(error)
    }

  },

  single_product: async (req, res, next) => {

    try {
      if (req.session.loggedIn) {
        let user = req.session.user
        cartCount = await cartHelpers.getCartCount(req.session.user._id)
        let product = req.params.id

        console.log(product);

        let products = await productHelpers.getProductDetails(product)


        res.render('user/single-product', { layout: 'user-layout', userq: true, products, user, cartCount })

      } else {
        let product = req.params.id
        let products = await productHelpers.getProductDetails(product)


        res.render('user/single-product', { layout: 'user-layout', userq: true, products })

      }


    } catch (error) {

      next(error)

    }






  },

  user_login: (req, res, next) => {

    try {

      if (req.session.loggedIn) {
        let user = req.session.user
        productHelpers.getAllProduct().then((products) => {
          res.render('user/user-home', { layout: 'user-layout', userq: true, user, products })
        })
      } else {
        res.render('user/login')
      }

    } catch (error) {

      next(error)
    }

  },


  user_signUp: (req, res, next) => {
    try {
      signUpErr = req.session.signUpErr
      res.render('user/signup', { signUpErr })

    } catch (error) {

      next(error)

    }

  },






  user_otp: (req, res, next) => {
    try {
      invalid = req.session.message
      res.render('user/otp', { invalid })

    } catch (error) {

      next(error)

    }

  },


  user_postSignUp: (req, res, next) => {
    try {
      userHelpers.verifyUser(req.body).then((response) => {
        console.log(response);
        if (response.status) {
          req.session.body = req.body
          console.log(req.session.body);

          twilioHelpers.doSms(req.body).then((data) => {
            req.session.body = req.body

            console.log(req.session.body);

            if (data) {

              res.redirect('/otp')
            } else {
              res.redirect('/signup')
            }
          })
        } else {
          req.session.signUpErr = "Email already exists"
          res.redirect('/signup')
        }

      })


    } catch (error) {

      next(error)
    }

  },


  user_postOtp: (req, res, next) => {
    try {
      twilioHelpers.otpVerify(req.body, req.session.body).then((response) => {

        if (response) {

          userHelpers.doSignUp(req.session.body).then((response) => {

            res.redirect('/login')
          })

        } else {
          req.session.message = "Invalid  OTP"
          res.redirect('/otp')


        }


      })

    } catch (error) {

      next(error)

    }


  },


  user_postLogin: (req, res, next) => {
    try {
      userHelpers.doLogin(req.body).then((response) => {
        if (response.status) {
          req.session.loggedIn = true
          req.session.user = response.user
          res.redirect('/')
        } else {
          res.redirect('/login')
        }
      })

    } catch (error) {

      next(error)

    }


  },


  user_logout: (req, res, next) => {
    try {
      req.session.loggedIn = null;
      req.session.loggedIn = false
      res.redirect('/')

    } catch (error) {

      next(error)

    }

  },


  user_about: (req, res, next) => {
    try {
      let user = req.session.user
      res.render('user/about', { layout: 'user-layout', userq: true, user })

    } catch (error) {

      next(error)

    }

  },

  user_cart: async (req, res, next) => {
    try {
      console.log('kkkkk');
      let user = req.session.user
      let products = await cartHelpers.getCartProduct(req.session.user._id)
      let totalValue = 0
      if (products.length > 0) {
        totalValue = await cartHelpers.getTotalAmount(req.session.user._id)
      }





      res.render('user/cart', { layout: 'user-layout', userq: true, products, user, totalValue })

    } catch (error) {

      next(error)

    }

  },



  user_addToCart: async (req, res, next) => {
    try {



      let cartIt = await cartHelpers.addToCart(req.session.user._id, req.params.id)

      res.json({ status: true })

    } catch (error) {

      next(error)

    }




  },

  changeProdQuantity: (req, res, next) => {
    try {
    
      let user = req.session.user

      cartHelpers.changeProductQuantity(req.body).then(async (response) => {
        console.log(req.session.user);

        response.total = await cartHelpers.getTotalAmount(user._id)



        res.json(response)

      })

    } catch (error) {

      next(error)

    }

  },

  deleteProduct: (req, res, next) => {
    try {
      console.log(req.body);

      cartHelpers.deleteProduct(req.body).then((resposne) => {
        console.log(resposne, "kooooi")

        res.json({ response })



      })

    } catch (error) {

      next(error)

    }

  },

  placeOrder: async (req, res, next) => {
    try {

      let viewCoupon = await couponHelpers.viewCoupon()

      let userId = req.session.user._id

      let user = req.session.user

      let addressId = req.query.id

      let selectAddress = await userHelpers.placeAddress(addressId, userId)

      let userAddress = await userHelpers.userAddress(userId)

      let total = await cartHelpers.getTotalAmount(req.session.user._id)

      res.render('user/place-order', { total, user, layout: 'user-layout', userq: true, userAddress, selectAddress, viewCoupon })

    } catch (error) {


      next(error)

    }

  },



  post_placeOrder: async (req, res, next) => {
    try {

      if(req.session.coupon){
        
      // let couponName =req.body.Couponname
      let user = await userHelpers.getUserDetails(req.session.user._id)

      let order = req.body

      let CoupDetails = req.session.coupon
    
      Couponname = CoupDetails.coupon

      let products = await cartHelpers.getCartProductList(req.body.userId)

      let totalPrice = await cartHelpers.getTotalAmount(req.body.userId)

      let discount = CoupDetails.price
      
      


     
      orderHelpers.placeOrder(order, products, totalPrice, req.session.user._id, discount,Couponname).then(async (orderId) => {


        if (req.body['payment-method'] === 'COD') {
          res.json({ codSuccess: true })
        } else {
          let GrandTotal =totalPrice - discount
          razorpayHelpers.generateRazorpay(orderId, GrandTotal).then((response) => {
            res.json(response)
          })
        }

      })

      }else{
        
     
      let user = await userHelpers.getUserDetails(req.session.user._id)

      let order = req.body

     

      let products = await cartHelpers.getCartProductList(req.body.userId)

      let totalPrice = await cartHelpers.getTotalAmount(req.body.userId)

      
      
       

      let GrandTotal = totalPrice
     
      orderHelpers.placeOrder(order, products, totalPrice, req.session.user._id).then(async (orderId) => {

        
        if (req.body['payment-method'] === 'COD') {
          res.json({ codSuccess: true })
        } else {
           GrandTotal = totalPrice

          razorpayHelpers.generateRazorpay(orderId, GrandTotal).then((response) => {
            res.json(response)
          })
        }

      })

      }



    } catch (error) {
      console.log(error);

      next(error)

    }


  },


  order_success: (req, res, next) => {
    try {
      let user = req.session.user
      res.render('user/order-success', { user: req.session.user, layout: 'user-layout', userq: true })

    } catch (error) {

      next(error)

    }


  },




  view_order: async (req, res, next) => {
    try {
      let user = req.session.user
      let singleId = req.params.id



      value = await orderHelpers.value(singleId)

      singleOrder = await orderHelpers.getSingleOrder(singleId)


      res.render('user/view-order', { layout: 'user-layout', userq: true, singleOrder, user, value })
    } catch (error) {

      next(error)
    }

  },



  order_list: async (req, res, next) => {
    try {
      let user = req.session.user
      order = await orderHelpers.getOrderDetails(req.session.user._id)

      console.log(order);
      res.render('user/order-list', { layout: 'user-layout', userq: true, order, user })

    } catch (error) {

      next(error)

    }

  },




  user_profile: async (req, res, next) => {
    try {

      user = req.session.user
      userId = req.session.user._id
      cartCount = await cartHelpers.getCartCount(req.session.user._id)
      let userAddress = await userHelpers.userAddress(userId)

      let userSignUpDetails = await userHelpers.getUserDetails(userId)

      res.render('user/user-profile', { layout: 'user-layout', userq: true, user, userSignUpDetails, userAddress, cartCount })


    } catch (error) {

      next(error)

    }

  },



  post_userProfile: async (req, res, next) => {
    try {
      console.log(req.body);
      userId = req.session.user._id

      let userProfileDetails = await userHelpers.profileDetails(req.body, userId)

      res.redirect('/user-profile')

    } catch (error) {
      next(error)
    }

  },



  post_updateName: async (req, res, next) => {
    try {
      userId = req.session.user._id

      let userName = await userHelpers.updateUsername(userId, req.body)

      res.redirect('/user-profile')

    } catch (error) {
      next(error)
    }


  },



  delete_address: async (req, res, next) => {
    try {
      userId = req.session.user._id
      addressId = req.params.id
      console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');


      let deleteAddress = await userHelpers.deleteAddress(addressId, userId)

      res.redirect('/user-profile')

    } catch (error) {
      next(error)
    }

  },



  post_updatePassword: async (req, res, next) => {
    try {
      userId = req.session.user._id


      let userPassword = await userHelpers.updateUserPassword(userId, req.body)

      res.redirect('/user-profile')

    } catch (error) {
      next(error)

    }


  },





  post_editAddress: async (req, res, next) => {
    try {
      userId = req.session.user._id
      addressId = req.params.id

      console.log(addressId);

      let editAddress = await userHelpers.editAddress(userId, req.body, addressId)

      res.redirect('/user-profile')

    } catch (error) {
      next(error)
    }



  },




  post_verifyPayment: (req, res, next) => {
    try {
      console.log(req.body);
      razorpayHelpers.verifyPayment(req.body).then(() => {
        razorpayHelpers.changePaymentStatus(req.body['order[receipt]']).then(() => {
          console.log('Payment successful');
          res.json({ status: true })
        })
      }).catch((err) => {
        console.log(err);
        res.json({ status: false, errMsg: ' ' })

      });

    } catch (error) {
      next(error)
    }

  },




  item_cancelled: async (req, res, next) => {
    try {
      orderId = req.params.id
      console.log('cancelled');
      console.log(orderId);
      itemCancelled = orderHelpers.changeStatusCancelled(orderId)
      res.redirect('/order-list')

    } catch (error) {
      next(error)
    }

  },





  post_applyCoupon: (req, res, next) => {
    try {
      console.log('aplyyyyyyyyyyyyyyyyyyyyy');
      console.log(req.body, 'reqqqqqqqqqqqqqqqqqqqqqqqq bodyyyyyyyyyyyyyyyyyyyyyyyy');

      couponHelpers.getAllCoupon(req.body).then((response) => {
        console.log(response, 'cpoupon vanuuuuuuuuuuuuuuu');
        if (response.coupon) {
          req.session.coupon = response
          let addUser = couponHelpers.addUser(req.body)
        }

        res.json(response)



      })

    } catch (error) {
      next(error)
    }


  }





}

