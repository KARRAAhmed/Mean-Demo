const express = require('express') ;
const bodyParse = require('body-parser') ;
const app = express() ;
const mongoose = require('mongoose');
const postRouter =require('./routes/posts');
const userRouter =require('./routes/user');
const path = require('path') ;


mongoose.connect('mongodb://localhost:27017/coshare', {useNewUrlParser: true ,useCreateIndex: true})
.then(()=>
{
  console.log('you are connected') ;
})
.catch(()=>
{
  console.log('you are not connected') ;
});


app.use(bodyParse.json()) ;
app.use(bodyParse.urlencoded({extended:false})) ;
app.use("/images",express.static(path.join('backend/images'))) ;
// create middleware
 //app.use((req,res,next)=>{
  //console.log('First Midellware') ;
  //next() ;
////})
//app.use((req,res,next)=>{
  //res.send('hello from express')
//})
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Authorization,Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT,DELETE, OPTIONS"
  );
  next();
});

app.use('/api/posts',postRouter) ;
app.use('/api/user',userRouter) ;
//export this file
module.exports = app ;
