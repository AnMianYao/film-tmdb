//后端服务器
const userApi = require('./api/userApi');
const fs=require("fs");
const path=require("path");
const bodyParser=require('body-parser');
const express=require("express");
let  session = require('express-session');


const app=express();
let options={
  'host':"127.0.0.1",
  'port':'6379',
  'ttl': 60*30,//session 有效期为30min;
};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret:"session is powerful",
  resave:false,
  saveUninitialized:true,
  cookie:{
    path:"/",
    username:"default",
    maxAge:30*60*1000
  }
}));
// 后端api路由
app.use('/api/user', userApi);

app.listen(3000);
console.log('success listen at port:3000......');
