const { response } = require('express');
const express = require('express');
const router = express.Router();
const adminHelpers = require('../helpers/admin-helpers');

const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const categoryHelpers = require('../helpers/category-helpers');
const orderHelpers = require('../helpers/order-helpers');
const dashboardHelpers = require('../helpers/dashboard-helpers');

const couponHelpers = require('../helpers/coupon-helpers');

const bannerHelpers = require('../helpers/banner-helpers');

module.exports = {

  admin_home: async (req, res, next) => {

    try {

      if (req.session.adminloggedIn) {

        let adminw = req.session.admin
        let userCount = await dashboardHelpers.getUserCount()
        let orderCount = await dashboardHelpers.getOrderCount()
        let codCount = await dashboardHelpers.totalCOD()

        let ONLINECount = await dashboardHelpers.totalONLINE()

        let totalDelivered = await dashboardHelpers.totalDelivered()

        let totalShipped = await dashboardHelpers.totalShipped()

        let cancelled = await dashboardHelpers.cancelled()

        let monthamount = await dashboardHelpers.totalMonthAmount()


        // let totalDeliveredCanceled = await dashboardHelpers.totalDeliveredCanceled()

        console.log(monthamount, 'monthamount is hereeeeeeeeeeeeeeeeeeeee');
        res.render('admin/admin-home', { layout: 'admin-layout', admin: true, adminw, userCount, orderCount, codCount, ONLINECount, totalDelivered, totalShipped, cancelled, monthamount })
      } else {
        res.redirect('/admin/login',)
      }

    } catch (error) {

      next(error)
    }


  },


  admin_login: function (req, res,next) {
    try {
      res.render('admin/admin-login', { layout: 'admin-layout' })
    } catch (error) {
      next(error)
    }
    
  },



  admin_postlogin: function (req, res,next) {

    try {
      adminHelpers.adminLogin(req.body).then((response) => {
        if (response.status) {
          req.session.adminloggedIn = true
          req.session.admin = response.admin
          res.redirect('/admin')
        } else {
          res.redirect('/admin/login',)
        }
      })

    } catch (error) {

      next(error)

    }

  },


  admin_logout: function (req, res,next) {
    try {
      req.session.adminLoggedIn = null;
      req.session.adminLoggedIn = false
      res.redirect('/admin/login')

    } catch (error) {
      next(error)
    }

  },

  admin_userManage: (req, res,next) => {
    try {
      userHelpers.getAllUsers().then((userdetails) => {
        res.render('admin/user-manage', { layout: 'admin-layout', admin: true, userdetails });
      })

    } catch (error) {
      next(error)
    }

  },



  block_user: (req, res,next) => {
    try {
      let userId = req.params.id;
      userHelpers.blockUser(userId).then((response) => {
        res.redirect('/admin/user-manage');
      })

    } catch (error) {
      next(error)

    }

  },

  user_active: (req, res,next) => {
    try {
      let userId = req.params.id;
      console.log(userId)
      userHelpers.activeUser(userId).then((response) => {
        res.redirect('/admin/user-manage');
      })

    } catch (error) {
      next(error)
    }

  },


  admin_viewProduct: (req, res,next) => {
    try {
      productHelpers.getAllProduct().then((products) => {

        res.render('admin/view-product', { layout: 'admin-layout', admin: true, products })


      })

    } catch (error) {
      next(error)

    }

  },

  admin_getAddProduct: async (req, res,next) => {
    try {
      category = await categoryHelpers.viewCategory()


      res.render('admin/add-product', { layout: 'admin-layout', admin: true, category })

    } catch (error) {
      next(error)
    }


  },


  admin_postAddProduct: (req, res,next) => {
    try {
      console.log(req.body);
      productHelpers.addProduct(req.body, (id) => {
        let image = req.files.Image

        image.mv('./public/product-images/' + id + '.png', (err, done) => {
          if (!err) {

            res.render('admin/add-product', { layout: 'admin-layout', admin: true })



          } else {
            console.log(err);
          }
        })
      })

    } catch (error) {
      next(error)

    }


  },


  admin_deleteProduct: (req, res,next) => {
    try {
      let proId = req.params.id
      productHelpers.deleteProduct(proId).then((response) => {
        res.redirect('/admin/view-product')
      })

    } catch (error) {
      next(error)

    }

  },


  admin_editProduct: async (req, res,next) => {
    try {
      let product = await productHelpers.getProductDetails(req.params.id)

      let catdetails = await categoryHelpers.viewCategory()

      console.log(catdetails);
      res.render('admin/edit-product', { layout: 'admin-layout', admin: true, product, catdetails })

    } catch (error) {
      next(error)

    }


  },



  admin_postEditProduct: (req, res,next) => {

    try {
      let id = req.params.id
      productHelpers.updateProduct(req.params.id, req.body).then(() => {
        res.redirect('/admin/view-product')
        if (req.files.Image) {
          let image = req.files.Image
          image.mv('./public/product-images/' + id + '.png')
        }
      })

    } catch (error) {
      next(error)

    }

  },


  admin_categoryMange: (req, res,next) => {
    try {

      categoryHelpers.viewCategory().then((category) => {

        res.render('admin/category-manage', { layout: 'admin-layout', admin: true, category })

      })

    } catch (error) {
      next(error)

    }


  },


  admin_addCategory: (req, res,next) => {
    try {
      res.render('admin/add-category', { layout: 'admin-layout', admin: true })

    } catch (error) {
      next(error)
    }


  },


  admin_postAddCategory: (req, res,next) => {
    try {
      console.log('kkkkkkkkk');
      console.log(req.body);

      categoryHelpers.insertCategory(req.body).then((data) => {

        res.redirect('/admin/add-category')
      })

    } catch (error) {
      next(error)

    }

  },


  admin_deleteCategory: (req, res, next) => {
    try {
      let catId = req.params.id
      categoryHelpers.deleteCategory(catId).then((response) => {
        res.redirect('/admin/category-manage')
      })

    } catch (error) {
      next(error)
    }

  },






  orderList: async (req, res,next) => {

    try {
      order = await orderHelpers.admingetOrder()

      res.render('admin/order-list', { layout: 'admin-layout', admin: true, order })
    } catch (error) {
      next(error)
    }



  },




  view_order: async (req, res,next) => {
    try {
      singleId = req.params.id
      singleOrder = await orderHelpers.getSingleOrder(singleId)
      value = await orderHelpers.value(singleId)
      buttonchange = await orderHelpers.btnChange(singleId)
      console.log(buttonchange, "button");

      res.render('admin/view-order', { singleOrder, singleId, layout: 'admin-layout', admin: true, value, buttonchange })
    } catch (error) {
      next(error)
    }

  },

  item_packed: async (req, res,next) => {
    try {
      orderId = req.params.id

      changeStatusPacked = orderHelpers.changeStatus(orderId)
      res.redirect('/admin/order-list')

    } catch (error) {
      next(error)
    }


  
  },

  item_shipped: async (req, res,next) => {
    try {
      orderId = req.params.id
      changeStatusShipped = orderHelpers.changeStatusShipped(orderId)
      res.redirect('/admin/order-list')

    } catch (error) {
      next(error)
    }


  },

  item_delivered: async (req, res,next) => {
    try {
      orderId = req.params.id
      changeStatusDelivered = orderHelpers.changeStatusDelivered(orderId)
      res.redirect('/admin/order-list')

    } catch (error) {
      next(error)
    }

  },

  couponManage: async (req, res,next) => {
    try {
      let viewCoupon = await couponHelpers.viewCoupon()
      res.render('admin/coupon-manage', { layout: 'admin-layout', admin: true, viewCoupon })

    } catch (error) {
      next(error)
    }

  },

  addCoupon: (req, res,next) => {
    try {
      res.render('admin/add-coupon', { layout: 'admin-layout', admin: true, })

    } catch (error) {
      next(error)
    }

  },

  post_addCoupon: async (req, res,next) => {
    try {
      let coupon = req.body
      addCoupon = await couponHelpers.addCoupon(req.body)

      res.redirect('/admin/coupon-manage')

    } catch (error) {
      next(error)
    }



  },

  deleteCoupon: (req, res,next) => {
    try {
      let couponId = req.params.id
      let deleteCoupon = couponHelpers.deleteCoupon(couponId)
      res.redirect('/admin/coupon-manage')

    } catch (error) {
      next(error)
    }

  },

  bannerManage: async (req, res,next) => {
    try {
      let viewBanner = await bannerHelpers.viewBanner()
      console.log(viewBanner);
      res.render('admin/banner-manage', { layout: 'admin-layout', admin: true, viewBanner })

    } catch (error) {
      next(error)
    }


  },

  addBanner: (req, res,next) => {
    try {
      res.render('admin/add-banner', { layout: 'admin-layout', admin: true, })
    } catch (error) {
      next(error)
    }

  },


  post_addBanner: async (req, res,next) => {
    try {
      let addBanner = await bannerHelpers.addbanner(req.body, (id) => {
        let image = req.files.Image
        image.mv('./public/product-images/' + id + '.png', (err, done) => {
          if (!err) {
            res.redirect('/admin/banner-manage')


          } else {
            console.log(err);
          }
        })
      })



    } catch (error) {
      next(error)
    }




  },


  deleteBanner: async (req, res,next) => {
    try {
      let bannerId = req.params.id

    let deleteBanner = await bannerHelpers.deleteBanner(bannerId)
    res.redirect('/admin/banner-manage')
      
    } catch (error) {
      next(error)
    }

    
  },









}