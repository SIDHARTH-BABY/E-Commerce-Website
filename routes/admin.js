const { response } = require('express');
const express = require('express');
const router = express.Router();
const adminControllers = require('../controlers/admin-controllers');

const createError = require('http-errors');



const adminverifyLogin =(req,res,next)=>{
    if( req.session.adminloggedIn){
      next()
    }else{
      res.redirect('/admin/login')
    }
  }

/* GET users listing. */
router.get('/',adminverifyLogin,adminControllers.admin_home);





router.get('/login',adminControllers.admin_login)




router.post('/admin-login',adminControllers.admin_postlogin )




router.get('/admin-logout',adminControllers.admin_logout)




router.get('/user-manage',adminverifyLogin,adminControllers.admin_userManage)




router.get('/user-block/:id',adminverifyLogin,adminControllers.block_user)




router.get('/user-active/:id',adminverifyLogin,adminControllers.user_active)





router.get('/view-product',adminverifyLogin,adminControllers.admin_viewProduct)




router.get('/add-product',adminverifyLogin,adminControllers.admin_getAddProduct)




router.post('/add-product',adminverifyLogin,adminControllers.admin_postAddProduct)




router.get('/delete-product/:id',adminverifyLogin,adminControllers.admin_deleteProduct)




router.get('/edit-product/:id',adminverifyLogin,adminControllers.admin_editProduct)




router.post('/edit-product/:id',adminverifyLogin,adminControllers.admin_postEditProduct)



router.get('/category-manage',adminverifyLogin,adminControllers.admin_categoryMange)



router.get('/add-category',adminverifyLogin,adminControllers.admin_addCategory)



router.post('/add-category',adminverifyLogin,adminControllers.admin_postAddCategory)



router.get('/delete-category/:id',adminverifyLogin,adminControllers.admin_deleteCategory)



router.get('/order-list',adminverifyLogin,adminControllers.orderList)




router.get('/view-order/:id',adminverifyLogin,adminControllers.view_order)


router.get('/item-packed/:id',adminverifyLogin,adminControllers.item_packed)


router.get('/item-shipped/:id',adminverifyLogin,adminControllers.item_shipped)



router.get('/item-delivered/:id',adminverifyLogin,adminControllers.item_delivered)

router.get('/coupon-manage',adminverifyLogin,adminControllers.couponManage)

router.get('/add-coupon',adminverifyLogin,adminControllers.addCoupon)

router.post('/add-coupon',adminverifyLogin,adminControllers.post_addCoupon)

router.get('/delete-coupon/:id',adminverifyLogin,adminControllers.deleteCoupon)


router.get('/banner-manage',adminverifyLogin,adminControllers.bannerManage)


router.get('/add-banner',adminverifyLogin,adminControllers.addBanner)


router.post('/add-banner',adminverifyLogin,adminControllers.post_addBanner)


router.get('/delete-banner/:id',adminverifyLogin,adminControllers.deleteBanner)





router.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  router.use(function(err, req, res, next) {
    console.log(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('admin/error');
  });

module.exports = router;