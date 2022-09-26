const { response } = require('express');
const express = require('express');
const router = express.Router();
const adminHelpers = require('../helpers/admin-helpers');

const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const categoryHelpers = require('../helpers/category-helpers');

module.exports={

    admin_home:function(req, res, next) {

      try {

        if(req.session.adminloggedIn){
          let adminw = req.session.admin
        res.render('admin/admin-home',{layout: 'admin-layout',admin:true,adminw})
        }else{  
          res.redirect('/admin/login',)
        }
        
      } catch (error) {
        // res.render('/error',{error})
        //   console.log('notttttt');
        next(error);
      }
 
        
      },


      admin_login: function(req, res,) {
        res.render('admin/admin-login',{layout: 'admin-layout'})
    },



    admin_postlogin:function(req, res) {

      try {
        adminHelpers.adminLogin(req.body).then((response)=>{
          if(response.status){
            req.session.adminloggedIn = true
            req.session.admin=response.admin
            res.redirect('/admin')
          }else{
            res.redirect('/admin/login',)
          }
        })  
        
      } catch (error) {
        res.render('/error',{error})
        
      }
        
      },


      admin_logout: function(req, res) {
        try {
          req.session.adminLoggedIn=null;
          req.session.adminLoggedIn=false  
          res.redirect('/admin/login')
          
        } catch (error) {
          res.render('/error',{error})
        }
       
      },

      admin_userManage:(req, res)=>{
        try {
          userHelpers.getAllUsers().then((userdetails)=>{
            res.render('admin/user-manage',{layout: 'admin-layout',admin:true,userdetails});
            })
          
        } catch (error) {
          res.render('/error',{error})
        }
        
      },

     

      block_user:(req, res)=>{
        try {
          let userId = req.params.id;
          userHelpers.blockUser(userId).then((response)=>{
            res.redirect('/admin/user-manage');
          })
          
        } catch (error) {
          res.render('/error',{error})
          
        }
       
      },

      user_active:(req, res)=>{
        try {
          let userId = req.params.id;
        console.log(userId)
        userHelpers.activeUser(userId).then((response)=>{
          res.redirect('/admin/user-manage');
        })
          
        } catch (error) {
          res.render('/error',{error})
          
        }
        
      },


      admin_viewProduct:(req,res)=>{
        try {
          productHelpers.getAllProduct().then((products)=>{
      
            res.render('admin/view-product',{layout: 'admin-layout',admin:true,products})
        
          
          })
          
        } catch (error) {
          res.render('/error',{error})
          
        }
      
      },
      
      admin_getAddProduct:async(req,res)=>{
        try {
          category = await categoryHelpers.viewCategory()

              
        res.render('admin/add-product',{layout: 'admin-layout',admin:true,category})  
          
        } catch (error) {
          res.render('/error',{error})
        }
       
        
            
      
      },


      admin_postAddProduct:(req,res)=>{
        try {
          console.log(req.body);
          productHelpers.addProduct(req.body,(id)=>{
            let image = req.files.Image
          
            image.mv('./public/product-images/'+id +'.png',(err,done)=>{
              if(!err){
                
                  res.render('admin/add-product',{layout: 'admin-layout',admin:true})
        
              
               
              }else{
                console.log(err);
              }
            })
          })
          
        } catch (error) {
          res.render('/error',{error})
          
        }

       
      },

      
      admin_deleteProduct:(req,res)=>{
        try {
          let proId = req.params.id
        productHelpers.deleteProduct(proId).then((response)=>{
          res.redirect('/admin/view-product')
        })
          
        } catch (error) {
          res.render('/error',{error})
          
        }
        
      },


      admin_editProduct:async(req,res)=>{
        try {
          let product = await productHelpers.getProductDetails(req.params.id)
      
        let catdetails = await categoryHelpers.viewCategory()
        
        console.log(catdetails);
        res.render('admin/edit-product',{product,catdetails})
          
        } catch (error) {
          res.render('/error',{error})
          console.log('notttttt');
          
        }

        
      },



      admin_postEditProduct:(req,res)=>{

        try {
          let id=req.params.id
        productHelpers.updateProduct(req.params.id,req.body).then(()=>{
          res.redirect('/admin/view-product')
          if(req.files.Image){
            let image = req.files.Image
            image.mv('./public/product-images/'+id+'.png')  
          }
        })
          
        } catch (error) {
          res.render('/error',{error})
          console.log('notttttt');
          
        }
        
      },


      admin_categoryMange:(req,res)=>{
        try {
          
        categoryHelpers.viewCategory().then((category)=>{
        
          res.render('admin/category-manage',{layout: 'admin-layout',admin:true,category})
        
        })
          
        } catch (error) {
          res.render('/error',{error})
          
        }
  
         
        },


        admin_addCategory:(req,res)=>{
          try {
            res.render('admin/add-category',{layout: 'admin-layout',admin:true})
            
          } catch (error) {
            res.render('/error',{error})
        
            
          }
           
          
          },


          admin_postAddCategory:(req,res)=>{
            try {
              console.log('kkkkkkkkk');
              console.log(req.body);
    
              categoryHelpers.insertCategory(req.body).then((data)=>{
               
                res.redirect('/admin/add-category')
              })
              
            } catch (error) {
              res.render('/error',{error})
              
            }
           
          },


          admin_deleteCategory:(req,res)=>{
            try {
              let catId = req.params.id
            categoryHelpers.deleteCategory(catId).then((response)=>{
              res.redirect('/admin/category-manage')
            })
              
            } catch (error) {
              res.render('/error',{error})
            }
            
          }

}