const { response, request } = require('express');
const express = require('express');
const router = express.Router();
const userHelpers = require('../helpers/user-helpers');
const productHelpers = require('../helpers/product-helpers');
const twilioHelpers = require('../helpers/twilio-helpers');
const categoryHelpers = require('../helpers/category-helpers');
const cartHelpers = require('../helpers/cart-helpers');
const orderHelpers = require('../helpers/order-helpers');





module.exports = {

  user_home: async (req, res, next) => {
    try {
      let cartCount = null

      if (req.session.loggedIn) {

        let user = req.session.user

        cartCount = await cartHelpers.getCartCount(req.session.user._id)

        products = await productHelpers.getAllProduct()

        catdetails = await categoryHelpers.viewCategory()

        res.render('user/user-home', { layout: 'user-layout', userq: true, products, user, catdetails, cartCount })

      } else {
        products = await productHelpers.getAllProduct()

        catdetails = await categoryHelpers.viewCategory()

        res.render('user/user-home', { layout: 'user-layout', userq: true, products, catdetails })

      }

    } catch (error) {

      res.redirect('/err', { error })
    }

  },

  category_product: async (req, res, next) => {
    try {
      let user = req.session.user

      catdetails = await categoryHelpers.viewCategory()


      let catId = req.query.category

      console.log(catId);


      productHelpers.catProMatch(catId).then((products) => {
        console.log(products);
        res.render('user/user-category', { layout: 'user-layout', userq: true, products, user, catdetails })
      }).catch((err) => {

        res.render('user/user-category', { err })
       
      })

    } catch (error) {
      res.redirect('/err', { error })
    }



  },


  user_menu: async (req, res, next) => {
    try {
      if (req.session.loggedIn) {
        let user = req.session.user
        catdetails = await categoryHelpers.viewCategory()
        productHelpers.getAllProduct().then((products) => {
          res.render('user/user-menu', { layout: 'user-layout', userq: true, products, user, catdetails })
        })
      } else {
        productHelpers.getAllProduct().then(async (products) => {
          catdetails = await categoryHelpers.viewCategory()
          res.render('user/user-menu', { layout: 'user-layout', userq: true, products, catdetails })
        })
      }

    } catch (error) {
      res.redirect('/err', { error })
    }

  },

  single_product: async (req, res, next) => {

    try {
      let user = req.session.user

      let product = req.params.id

      console.log(product);

      let products = await productHelpers.getProductDetails(product)


      res.render('user/single-product', { layout: 'user-layout', userq: true, products, user })

    } catch (error) {
      res.redirect('/err', { error })

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
      res.redirect('/err', { error })
    }

  },

  user_signUp: (req, res) => {
    try {
      signUpErr = req.session.signUpErr
      res.render('user/signup', { signUpErr })

    } catch (error) {
      res.redirect('/err', { error })

    }

  },


  user_otp: (req, res) => {
    try {
      invalid = req.session.message
      res.render('user/otp', { invalid })

    } catch (error) {
      res.redirect('/err', { error })

    }

  },


  user_postSignUp: (req, res) => {
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
      res.redirect('/err', { error })
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
      res.redirect('/err', { error })

    }


  },


  user_postLogin: (req, res) => {
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
      res.redirect('/err', { error })

    }


  },


  user_logout: (req, res) => {
    try {
      req.session.loggedIn = null;
      req.session.loggedIn = false
      res.redirect('/')

    } catch (error) {
      res.redirect('/err', { error })

    }

  },


  user_about: (req, res) => {
    try {
      let user = req.session.user
      res.render('user/about', { layout: 'user-layout', userq: true, user })

    } catch (error) {
      res.redirect('/err', { error })

    }

  },

  user_cart: async (req, res) => {
    try {
      console.log('kkkkk');
      let user = req.session.user
      let products = await cartHelpers.getCartProduct(req.session.user._id)

      let totalValue = await cartHelpers.getTotalAmount(req.session.user._id)

      console.log(req.session.user._id + 'qqqqqqqqqqqqqqqqqqqqqqqq');
      console.log(totalValue);


      res.render('user/cart', { layout: 'user-layout', userq: true, products, user, totalValue })

    } catch (error) {
      res.redirect('/err', { error })

    }

  },



  user_addToCart: async (req, res) => {
    try {
      console.log('api call');

      console.log(req.params.id);

      console.log('heeeee');


      let cartIt = await cartHelpers.addToCart(req.session.user._id, req.params.id)

      res.json({ status: true })

    } catch (error) {
      res.redirect('/err', { error })

    }








    // res.redirect('/')




  },

  changeProdQuantity: (req, res, next) => {
    try {
      console.log(req.body);
      let user = req.session.user

      cartHelpers.changeProductQuantity(req.body).then(async (response) => {
        console.log(req.session.user);

        response.total = await cartHelpers.getTotalAmount(user._id)



        res.json(response)

      })

    } catch (error) {
      res.redirect('/err', { error })

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
      res.redirect('/err', { error })

    }

  },

  placeOrder: async (req, res) => {
    try {
     
      let userId =req.session.user._id
      let user = req.session.user
    
      let addressId = req.query.id
      console.log('addresidddddddddddddddddddddd');
      console.log(addressId);
      // let selectAddress=await userHelpers.placeAddress(addressId,userId)
      // console.log(selectAddress);
      
      let userAddress = await userHelpers.userAddress(userId)
    

      let total = await cartHelpers.getTotalAmount(req.session.user._id)
      res.render('user/place-order', { total, user, layout: 'user-layout', userq: true,userAddress })

    } catch (error) {

      res.redirect('/err', { error })

    }

  },



  post_placeOrder: async (req, res) => {
    try {
      console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
      let products = await cartHelpers.getCartProductList(req.body.userId)
      let totalPrice = await cartHelpers.getTotalAmount(req.body.userId)
      orderHelpers.placeOrder(req.body, products, totalPrice).then((response) => {
        console.log('kkkkkkkkkkkkkk');
        console.log(response);
        res.json({ status: true })

      })
      console.log(req.body);

    } catch (error) {
      res.redirect('/err', { error })

    }


  },


  order_success: (req, res) => {
    try {
      let user = req.session.user
      res.render('user/order-success', { user: req.session.user, layout: 'user-layout', userq: true})

    } catch (error) {
      res.redirect('/err', { error })

    }


  },


  

  view_order: async (req, res) => {
    try {
      let user = req.session.user
      let singleId = req.params.id
      singleOrder = await orderHelpers.getSingleOrder(singleId)
      console.log(singleOrder);

      res.render('user/view-order', { layout: 'user-layout', userq: true, singleOrder,user })
    } catch (error) {
      res.redirect('/err', { error })
    }

  },

  order_list: async (req, res) => {
    try {
      let user = req.session.user
      order = await orderHelpers.getOrderDetails(req.session.user._id)
      
      console.log(order);
      res.render('user/order-list', { layout: 'user-layout', userq: true, order ,user})

    } catch (error) {
      res.redirect('/err', { error })

    }

  },

  user_err:(req,res)=>{
    res.render('/err')
  },


  user_profile: async(req, res) => {
    try {
       user = req.session.user
      userId =req.session.user._id
      let userAddress = await userHelpers.userAddress(userId)
  
      let userSignUpDetails = await userHelpers.getUserDetails(userId)
   
      res.render('user/user-profile', { layout: 'user-layout', userq: true, user,userSignUpDetails,userAddress })

    } catch (error) {
      res.redirect('/err', { error })

    }

  },


  post_userProfile:async(req,res)=>{
    console.log(req.body);
    userId =req.session.user._id

    let userProfileDetails =await  userHelpers.profileDetails(req.body,userId)
    
    res.redirect('/user-profile')
  },



  post_updateName:async(req,res)=>{
    userId =req.session.user._id

    let userName = await userHelpers.updateUsername(userId,req.body)

    res.redirect('/user-profile')

  },



  delete_address:async(req,res)=>{
    userId =req.session.user._id
    addressId =req.params.id
    console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
    console.log(addressId);
    
    let deleteAddress= await userHelpers.deleteAddress(addressId,userId)
   
      res.redirect('/user-profile')


  },


  post_updatePassword:async(req,res)=>{
    userId =req.session.user._id
   
    console.log(req.body);
    let userPassword = await userHelpers.updateUserPassword(userId,req.body)

    res.redirect('/user-profile')

  },


  // get_editAddress:(req,res)=>{

  //   addressId=req.params.id
  //   res.redirect('/user-profile')

  // },


  post_editAddress: async (req, res) => {
    userId =req.session.user._id
    addressId=req.params.id
    console.log(req.body);
  console.log(addressId);
  
    let editAddress = await userHelpers.editAddress(userId,req.body,addressId)

    res.redirect('/user-profile')


  },

  // get_placeAddress:(req, res) => {
  
  //   userId =req.session.user._id
  //   let addressId = req.params.id
  
  //   let selectAddress=userHelpers.placeAddress(addressId,userId)

  //   res.render('user/place-order',{selectAddress})


  // }



 


}

