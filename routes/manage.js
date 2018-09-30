var express = require('express');
var router = express.Router();
// const mysql = require('mysql');
var request = require('request');
var JSON = require('JSON');
// var Iconv = require('iconv-lite');

const rp = require('request-promise');
const Promise = require('promise');

router.get(['/main.html', '/'], async(req, res) => {
  let userinfo = req.cookies.userinfo;
  let id;
  try{
    userinfo = JSON.parse(userinfo);
    id = userinfo.id;
    res.render('/manage/main');
  }catch(e) {
    res.render('index', {msg: "如果想使用个人管理功能，请先登录"});
  }

});
