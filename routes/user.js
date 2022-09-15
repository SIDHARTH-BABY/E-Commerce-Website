const { response } = require('express');
const express = require('express');
const router = express.Router();
const userHelpers = require('../helpers/user-helpers');
const productHelpers = require('../helpers/product-helpers');
const twilioHelpers = require('../helpers/twilio-helpers');
const categoryHelpers = require('../helpers/category-helpers');

/* GET home page. */



router.get('/', async(req, res, next)=> {
  
  if(req.session.loggedIn){
    
    let user=req.session.user

      products =  await productHelpers.getAllProduct()

      catdetails = await categoryHelpers.viewCategory()
      
      res.render('user/user-home',{layout: 'user-layout',userq:true,products,user,catdetails})
  
  }else{
    products =  await productHelpers.getAllProduct()

    catdetails = await categoryHelpers.viewCategory()

    res.render('user/user-home',{layout: 'user-layout',userq:true,products,catdetails})
  
  } 
});


router.get('/category-product',(req,res)=>{

  

  let catId = req.query.category
  console.log('ggggggggggggggggggggggg');
  console.log(catId);


  productHelpers.catProMatch(catId).then((products)=>{
    console.log(products);
    res.render('user/user-category',{layout: 'user-layout',userq:true,products})
  })

})


router.get('/user-menu',(req,res)=>{
  if(req.session.loggedIn){
    let user=req.session.user
  productHelpers.getAllProduct().then((products)=>{
    res.render('user/user-menu',{layout: 'user-layout',userq:true,products,user})
  })
  }else{
    productHelpers.getAllProduct().then((products)=>{ 
    res.render('user/user-menu',{layout: 'user-layout',userq:true,products})
  })
  }
})





router.get('/single-product',async(req,res)=>{


  // let product= await productHelpers.getProductDetails(req.params.id)
  // console.log('hhhhhh');
  // console.log(product);

  
let user=req.session.user

let productId = req.query.id

let name =req.query.name

let description = req.query.description

let price =req.query.price

res.render('user/single-product',{layout: 'user-layout',userq:true, productId,name,description,price,user})
 



})





router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    let user=req.session.user
    productHelpers.getAllProduct().then((products)=>{
    res.render('user/user-home',{layout: 'user-layout',userq:true,user,products})
    })
  }else{
    res.render('user/login')
  }
})



router.get('/signup',(req,res)=>{
  signUpErr = req.session.signUpErr
  res.render('user/signup',{signUpErr})
})

router.get('/otp',(req,res)=>{
  invalid = req.session.message
  res.render('user/otp',{invalid})
})


router.post('/signup',(req,res)=>{
userHelpers.verifyUser(req.body).then((response)=>{
  console.log(response);
  if(response.status){
    req.session.body =req.body
    console.log(req.session.body);
   

    twilioHelpers.doSms(req.body).then((data)=>{
      req.session.body = req.body
     
      console.log(req.session.body);
       
      if (data) {  
        
        res.redirect('/otp')
      } else {    
        res.redirect('/signup')
        }
    })
  }else{
    req.session.signUpErr ="Email already exists"
    res.redirect('/signup')
  }

})
  
})




router.post('/otp', (req, res, next) => {
  console.log('hhhhhhhhh');

  twilioHelpers.otpVerify(req.body, req.session.body).then((response) => {
    
if(response){

  userHelpers.doSignUp(req.session.body).then((response) => {   
   
    res.redirect('/login')
})

}else{
  req.session.message ="Invalid  OTP"
  res.redirect('/otp')
  
  
}
                 
 
})
})





router.post('/login',(req,res)=>{
  
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){   
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      res.redirect('/login')     
    }
  })
})




router.get('/logout',(req,res)=>{
  req.session.loggedIn=null;
  req.session.loggedIn=false
  res.redirect('/')
})

router.get('/user-about',(req,res)=>{
  res.render('user/about',{layout: 'user-layout',userq:true})
})






module.exports = router;
