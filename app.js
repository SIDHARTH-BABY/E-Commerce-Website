var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let hbs = require('express-handlebars');

const dotenv = require("dotenv")
dotenv.config({path: './config.env'})

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var app = express();
var fileUpload = require('express-fileupload')

var db = require('./config/connection');
var session=require('express-session')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({helpers:{inc:function(value,options){return parseInt(value)+1;}},extname:'hbs',defaultLayout:'user-layout',layoutsDir:__dirname+'/views/layouts/',partialsDir:__dirname+'/views/partials/', runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true,},}));
// app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'user-layout', layoutsDir: __dirname + '/views/layouts/', partialsDir: __dirname + '/views/partials/' }));
// app.engine('hbs',hbs.engine({extname:'hbs', layoutsDir:__dirname + '/views/layouts/'}))





app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(session({secret:'Key',cookie:{maxAge:60000}}))

app.use(function(req,res,next){
  res.header('Cache-Control','no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0');
 
  next();
})

db.connect((err)=>{
  if(err) console.log("connection error"+err);
  else  console.log("database connected ");
  
})
app.use('/', userRouter);
app.use('/admin', adminRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
