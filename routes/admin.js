const { response } = require('express');
const express = require('express');
const router = express.Router();
const adminControllers = require('../controlers/admin-controllers');



/* GET users listing. */
router.get('/',adminControllers.admin_home);


router.get('/err',adminControllers.admin_err)


router.get('/login',adminControllers.admin_login)




router.post('/admin-login',adminControllers.admin_postlogin )




router.get('/admin-logout',adminControllers.admin_logout)




router.get('/user-manage',adminControllers.admin_userManage)




router.get('/user-block/:id',adminControllers.block_user)




router.get('/user-active/:id',adminControllers.user_active)





router.get('/view-product',adminControllers.admin_viewProduct)




router.get('/add-product',adminControllers.admin_getAddProduct)




router.post('/add-product',adminControllers.admin_postAddProduct)




router.get('/delete-product/:id',adminControllers.admin_deleteProduct)




router.get('/edit-product/:id',adminControllers.admin_editProduct)




router.post('/edit-product/:id',adminControllers.admin_postEditProduct)



router.get('/category-manage',adminControllers.admin_categoryMange)



router.get('/add-category',adminControllers.admin_addCategory)



router.post('/add-category',adminControllers.admin_postAddCategory)



router.get('/delete-category/:id',adminControllers.admin_deleteCategory)



router.get('/order-list',adminControllers.orderList)




router.get('/view-order/:id',adminControllers.view_order)


router.get('/item-packed/:id',adminControllers.item_packed)


router.get('/item-shipped/:id',adminControllers.item_shipped)



router.get('/item-delivered/:id',adminControllers.item_delivered)

module.exports = router;