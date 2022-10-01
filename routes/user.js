const { response } = require('express');
const express = require('express');
const router = express.Router();
const userContollers = require('../controlers/user-contollers');
const userHelpers = require('../helpers/user-helpers');

const verifyLogin =(req,res,next)=>{
    if(req.session.loggedIn){
      next()
    }else{
      res.redirect('/login')
    }
  }




/* GET home page. */


router.get('/', userContollers.user_home );


router.get('/err',userContollers.user_err)


router.get('/category-product',userContollers.category_product)


router.get('/user-menu',userContollers.user_menu)


router.get('/single-product/:id',userContollers.single_product)


router.get('/login',userContollers.user_login)



router.get('/signup',userContollers.user_signUp)



router.get('/otp',userContollers.user_otp)



router.post('/signup',userContollers.user_postSignUp)



router.post('/otp',userContollers.user_postOtp )



router.post('/login',userContollers.user_postLogin)




router.get('/logout',userContollers.user_logout)



router.get('/user-about',userContollers.user_about)



router.get('/cart',verifyLogin, userContollers.user_cart)



router.get('/add-to-cart/:id',verifyLogin, userContollers.user_addToCart)



router.post('/change-product-quantity',userContollers.changeProdQuantity)



router.post('/delete-product',userContollers.deleteProduct)


router.get('/place-order',verifyLogin,userContollers.placeOrder)


router.post ('/place-order',userContollers.post_placeOrder)


router.get('/order-success',verifyLogin,userContollers.order_success)


router.get('/view-order/:id',verifyLogin,userContollers.view_order)


router.get('/order-list',verifyLogin,userContollers.order_list)

router.get('/user-profile',verifyLogin,userContollers.user_profile)


router.post('/user-profile',verifyLogin,userContollers.post_userProfile)


router.post('/update-name',verifyLogin,userContollers.post_updateName)


router.post('/update-password',verifyLogin,userContollers.post_updatePassword)


router.get('/delete-address/:id',verifyLogin,userContollers.delete_address)



// router.get('/edit-address/',verifyLogin,userContollers.get_editAddress)

router.post('/edit-address/:id',verifyLogin,userContollers.post_editAddress)












module.exports = router;
