const { response } = require('express');
const express = require('express');
const router = express.Router();
const adminHelpers = require('../helpers/admin-helpers');
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const categoryHelpers = require('../helpers/category-helpers');

/* GET users listing. */
router.get('/', function(req, res, next) {
 
  if(req.session.adminloggedIn){
    let adminw = req.session.admin
  res.render('admin/admin-home',{layout: 'admin-layout',admin:true,adminw})
  }else{  
    res.redirect('/admin/login',)
  }
});




router.get('/login', function(req, res,) {
    res.render('admin/admin-login',{layout: 'admin-layout'})
})




router.post('/admin-login', function(req, res) {
  adminHelpers.adminLogin(req.body).then((response)=>{
    if(response.status){
      req.session.adminloggedIn = true
      req.session.admin=response.admin
      res.redirect('/admin')
    }else{
      res.redirect('/admin/login',)
    }
  })  
})




router.get('/admin-logout', function(req, res) {
  req.session.adminLoggedIn=null;
  req.session.adminLoggedIn=false  
  res.redirect('/admin/login')
})




router.get('/user-manage',(req, res)=>{
  userHelpers.getAllUsers().then((userdetails)=>{
  res.render('admin/user-manage',{layout: 'admin-layout',admin:true,userdetails});
  })
})




router.get('/user-block/:id',(req, res)=>{
  let userId = req.params.id;
userHelpers.blockUser(userId).then((response)=>{
  res.redirect('/admin/user-manage');
})
})




router.get('/user-active/:id',(req, res)=>{
  let userId = req.params.id;
  console.log(userId)
  userHelpers.activeUser(userId).then((response)=>{
    res.redirect('/admin/user-manage');
  })
})





router.get('/view-product',(req,res)=>{
  productHelpers.getAllProduct().then((products)=>{

    res.render('admin/view-product',{layout: 'admin-layout',admin:true,products})

  
  })
})




router.get('/add-product',(req,res)=>{
  categoryHelpers.viewCategory().then((category)=>{
    console.log(category);

  res.render('admin/add-product',{layout: 'admin-layout',admin:true,category})

  })
})




router.post('/add-product',(req,res)=>{
  console.log(req.body);
  productHelpers.addProduct(req.body,(id)=>{
    let image = req.files.Image
    console.log(id);
    image.mv('./public/product-images/'+id +'.png',(err,done)=>{
      if(!err){
        
          res.render('admin/add-product',{layout: 'admin-layout',admin:true})

      
       
      }else{
        console.log(err);
      }
    })
  })
})




router.get('/delete-product/:id',(req,res)=>{
  let proId = req.params.id
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/view-product')
  })
})




router.get('/edit-product/:id',async(req,res)=>{
  let product = await productHelpers.getProductDetails(req.params.id)

  let catdetails = await categoryHelpers.viewCategory()
  
  console.log(catdetails);
  res.render('admin/edit-product',{product,catdetails})
})




router.post('/edit-product/:id',(req,res)=>{
  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin/view-product')
    if(req.files.Image){
      let image = req.files.Image
      image.mv('./public/product-images/'+id+'.png')  
    }
  })
})



router.get('/category-manage',(req,res)=>{
  
categoryHelpers.viewCategory().then((category)=>{

  res.render('admin/category-manage',{layout: 'admin-layout',admin:true,category})

})
 
})

router.get('/add-category',(req,res)=>{
  res.render('admin/add-category',{layout: 'admin-layout',admin:true})

})


router.post('/add-category',(req,res)=>{
  
  categoryHelpers.insertCategory(req.body).then((data)=>{
   
    res.redirect('/admin/add-category')
  })
})

router.get('/delete-category/:id',(req,res)=>{
  let catId = req.params.id
  categoryHelpers.deleteCategory(catId).then((response)=>{
    res.redirect('/admin/category-manage')
  })
})







module.exports = router;
