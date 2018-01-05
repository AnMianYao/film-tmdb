let models=require('../dataBase');
let express=require('express');
let router=express.Router();
let mysql=require('mysql');
let $sql=require('../sqlMap');

// 连接数据库
let connection=mysql.createConnection(models.mysql);
connection.connect();

let jsonWrite=function (res,ret) {
  if (typeof ret==='undefined'){
    res.json({
      code:"1",
      msg:"operation failure"
    });
  }else {
    res.json(ret);

  }
};

router.get('/addUser',(req,res)=>{
  let sql=$sql.getPassword;
  let params=req.query;


  connection.query(sql,[params.username],function (err,result) {
    if (err){
      console.log(err);
    }
    if (result){
      req.session.username=params.username;
      req.session.save();
      res.cookie('sessionID', params.username, { domain: '', path: '/', httponly: true ,maxAge: 30*60*1000});
      jsonWrite(res,result);

      res.end();


    }
  });

});
router.get('/logout', function(req, res) {//做的登出页面
  req.session.destroy(function () {
    res.clearCookie("sessionID",{});
    jsonWrite(res,{
      'loginShow':false,
      'logged':false
    });
  });


});
router.get('/isToken',(req,res)=>{
  let sql=$sql.isNameToken;
  let params=req.query;


  connection.query(sql,[params.username],function (err,result) {
    if (err){
      console.log(err);
    }
    if (result){
      jsonWrite(res,result);
      res.end();
    }
  });

});
router.get('/favor',(req,res)=>{
  let sql=$sql.getFavor;
  let params=req.query;


  connection.query(sql,[params.username],function (err,result) {
    if (err){
      console.log(err);
    }
    if (result){
      jsonWrite(res,result);
      res.end();
    }
  });

});
router.post('/addUser',(req,res)=>{
  let sql=$sql.insert;
  let params=req.body;
  let session=req.session;
  connection.query(sql,[params.username,params.password,params.favors],function (err,result) {
    if (err){
      console.log(err);
    }
    if (result){
      //jsonWrite(res,result);
      res.end();
    }
  })

});
router.post('/favor',(req,res)=>{
  let sql=$sql.update;
  let params=req.body;
  connection.query(sql,[params.favors,params.username],function (err,result) {
    if (err){
      console.log(err);
    }
    if (result){
      jsonWrite(res,result);
      res.end();
    }
  })

});
module.exports=router;
