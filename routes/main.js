var express = require('express');
var router = express.Router();
const mysql = require('mysql');
var request = require('request');
var JSON = require('JSON');
var Iconv = require('iconv-lite');
var nodemailer = require('nodemailer');
const rp = require('request-promise');
const Promise = require('promise');
const Md5 = require(__dirname + '/../public/javascripts/md5.js');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'officialrikuki@gmail.com',
    pass: 'yymm0607'
  }
});

function getMysqlDate() {
  var date = new Date();
  var month = date.getMonth();
  var day = date.getDate();
  if (month >= 1 && month <= 9) month = "0" + month;
  if (day >= 1 && day <= 9) day = "0" + day;
  return date.getFullYear() + "-" + month + "-" + day;
}

function generateCode() {
  var  x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
  var  tmp = "";
  var timestamp = new Date().getTime();
  for (var i=0; i<10; i++)  {
    tmp  +=  x.charAt(Math.ceil(Math.random()*100000000)%x.length);
  }
  return  timestamp+tmp;
}

var pool1 = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "YYmm0607?!vr",
  database: "users"
});

let query = function (sql, values, pool) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      if (err) reject(err);
      else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          }
          else resolve(rows)
          connection.release();
        })
      }
    })
  })
}

let sendReq = function sendReq(url) {
  return new Promise((resolve, reject) => {
    request(url, function(err, resp, body) {
      if (err) reject(err);
      else resolve(body);
    });
  });
}

/* GET home page. */

/*
  code:
  2000: have user and token, update successfuly
  2001: have user but not request for weibo
  2002: have token but not user
  2003: have neither token nor token

  4000: fail in get token
  4002: have user but associate with weibo before
  4003: invalid user

*/


async function getToken(code) {
  let url = "https://api.weibo.com/oauth2/access_token?" + `client_id=1606107874&client_secret=dc58406953c628e820ad3aedfa70a4cf&grant_type=authorization_code&code=${code}&redirect_uri=http://www.rikuki.cn/passWeibo.html`;
  let data = {
    client_id: "1606107874",
    client_secret: "dc58406953c628e820ad3aedfa70a4cf",
    grant_type: "authorization_code",
    code: code,
    redirect_uri: "http://www.rikuki.cn/main.html"
  }
  let options = {
    method: 'POST',
    uri: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
      'Content-Type': 'application/json'
    },
    body: {},
    json: true
  };
  try {
    let response = await rp(options);
    return Promise.resolve({status: 2000, info:{token: response.access_token, uid: response.uid}});
  } catch(err) {
    console.log(err);
    return Promise.resolve({status: 4000, info: "get token fail"});
  }
}

async function getWeiboName(token, uid) {
  let url = "https://api.weibo.com/2/users/show.json?" + `access_token=${token}&uid=${uid}`;
  let options = {
    method: 'GET',
    uri: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
      'Content-Type': 'application/json'
    }
  };
  try {
    var response = await rp(options);
    return Promise.resolve({status: 2000, info: response.name});
  } catch(err) {
    return Promise.resolve({status: 4008, info: "get weibo name fail"});
  }
}

router.get('/passWeibo.html', async(req, res) => {
  let code = req.query.code;
  var status = 0;
  var info = "";
  var userInfo = req.cookies.userInfo;
  if (code) {
    var codeRes = await getToken(code);
    if (codeRes.status==2000) {
      var uid = codeRes.info.uid;
      let sql = `SELECT * FROM user WHERE uid = '${uid}'`
      let result = await query(sql, null, pool1);
      if (result!=0) {
        let id = result[0].id;
        let username = result[0].username ? result[0].username : result[0].email;
        let userinfo = {
          _id: id,
          _username: username
        };
        let expiresTime = new Date();
        let persistPeriod = 15*60*60*1000;
        expiresTime.setTime(expiresTime.getTime() + persistPeriod);
        res.cookie('userInfo', JSON.stringify(userInfo), {maxAge: persistPeriod, httpOnly: true, expires: expiresTime.toGMTString()});
        status = 2000;
        info = "login ok";
      } else {
        if (userInfo) {
          var _id = JSON.parse(userInfo)._id;
          if(_id) {
            let sql = `SELECT * FROM user WHERE id = '${_id}'`;
            let result = await query(sql, null, pool1);
            if (result.length==1) {
              var isweibo = result[0].isweibo;
              if (isweibo) {
                status = 4002;
                info = "you have already assocaited with a weibo account || you are in logged status";
              } else {
                let sql2 = `SELECT * FROM user WHERE uid = '${uid}'`;
                let result2 = await query(sql, null, pool1);
                if (result2.length == 0) {
                  let update_sql = `UPDATE user SET isweibo = 1, weiboToken = "${token}", uid = ${uid} WHERE id = ${_id}`;
                  let updateResult = await query(update_sql, null, pool1);
                  status = 2000;
                  info = "your are successfuly assocaited with a weibo account";
                } else {
                  status = 4004;
                  info = "this weibo account has been used before";
                }
              }
            }
          } else {
            status = 2003;
            info = "need to Add user";
          }
        }
      }
    } else {
      status = 4000;
      info = "get Weibo Token fail";
    }
  } else {
    status = 3000;
    info = "wrong url for passweibo";
  }
  console.log({status: status, info: info});
  // res.render('main', {'passweibo': {status: status, info: info}, 'userInfo': userInfo});
});

router.get('/shopping.html', async(req, res) => {
  res.render('shopping');
});

router.get('/login.html', (req, res) => {
  res.render('login');
});


router.get(['/main.html', '/'], async(req, res, next) =>{
  var seriesInfo;
  var userInfo = req.cookies.userinfo;
  var id;
  try{
    userInfo = JSON.parse(userInfo);
    id = userInfo.id;
  }catch(e) {
    if(!id){
      userInfo = {
        id: "",
        username: ""
      };
      id = "";
    }
  }
  if (id) {
    let sql = `SELECT * FROM user WHERE id = '${id}'`;
    var result = await query(sql, null, pool1);
    if (result.length==1) {
      seriesInfo = {status:200, info: "get login status ok"};
    } else {
        seriesInfo = {status:401, info: "incorrect id"};
    }
  } else {
    seriesInfo = {status: 201, info: "no cookies"};
  }
  userInfo.seriesInfo = seriesInfo;
  console.log(userInfo);
  res.render('main', {userInfo: userInfo});
  // var _id;
  // try{
  //   userInfo = JSON.parse(userInfo);
  //   _id = userInfo._id;
  // }catch(e) {
  //   if(!_id){
  //     userInfo = {
  //       _id: "",
  //       _username: ""
  //     };
  //     _id = "";
  //   }
  // }
  // if (_id) {
  //   let sql = `SELECT * FROM user WHERE id = '${_id}'`;
  //   var result = await query(sql, null, pool1);
  //   if (result.length==1) {
  //     var isweibo = result[0].isweibo;
  //     var weiboname = "";
  //     userInfo.weiboToken = weiboname
  //     userInfo.isweibo = isweibo;
  //     if (isweibo) {
  //       let token = result[0].weiboToken;
  //       var nameRes = await getWeiboName(token);
  //       if (nameRes.status == 2000) weiboname = nameRes.info;
  //       seriesInfo = {status:2000, info: "correct id and has weibo"};
  //     } else  {
  //       seriesInfo = {status:2000, info: "correct id and has no weibo"};
  //     }
  //   } else {
  //       seriesInfo = {status:4000, info: "incorrect id"};
  //   }
  // } else {
  //   seriesInfo = {status: 20001, info: "no user"};
  // }
  // userInfo.seriesInfo = seriesInfo;
  // console.log(userInfo);
  // if (req.query.title) {
  //   res.render('game');
  // }
  // else {
  //   if (req.query.key) res.render('machine');
  //   else res.render('main');
  // }  next();
});

router.get('/admin.html', async(req, res) => {
  let info = "";
  var userinfo = req.cookies.userinfo;
  console.log(userinfo);
  try{
    userinfo = JSON.parse(userinfo);
    console.log(userinfo);
    var id = userinfo.id;
  } catch(e) {
    res.render('index', {msg: "invalid url, highly recommend you login first"});
  }
  if(id) {
    let sql = `SELECT * FROM user WHERE id = '${id}'`;
    var result = await query(sql, null, pool1);
    if (result.length==1) {
      if (result[0].type=='1') {
        res.render('adminCtrl');
      }else {
        res.render('index', {msg: 'sorry you are not authorized for updating database'});
      }
    } else {
      res.render('index', {msg: "invalid user id"});
    }
  }
});

router.post('/logout', async(req, res) => {
  var id = req.body.id;
  console.log(id);
  res.cookie("userinfo", null);
  res.json({
    data: "logout ok",
    code: 200,
    status: "success"
  })
  return 0;
});

router.get('/signup.html', function(req, res, next) {
  res.render('signup');
  next();
});

router.get('/search.html',  async(req, res) => {
  url = "http://www.rikuki.cn/api/search?keyword=" + encodeURI(req.query.keyword);
  console.log(url);
  var links = [];
  var urls = [];
  var urls = await sendReq(url);
  urls = JSON.parse(urls);
  urls = urls.info;
  for(var i=0; i<urls.length; i++) {
    links.push({
      url: urls[i],
      text: "haha"
    })
  }
  res.render('search', { keyword: req.query.keyword, links: links} );
});

router.post('/post_login', async(req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  console.log(username);
  var sql = `SELECT * FROM user WHERE username = '${username}' OR email = '${username}'`;
  var status = "";
  var code;
  var data = "";
  var result = await query(sql, null, pool1);
  if (result.length == 0) {
      status = 'error';
      code = 401;// wrong username;
      data = "wrong username"
  }
  else {
    var tmpPwd = result[0].password;
    if (result[0].activate == 1) {
      if (tmpPwd === password) {
        code = 200;
        status = 'success'; // verify ok;
        var userInfo = {
          id: result[0].id,
          username: username
        }
        data = JSON.stringify(userInfo);
        var expiresTime = new Date();
        if(req.body.remembered) {
          var persistPeriod = 30*24*60*60*1000;
        }
        else {
          var persistPeriod = 15*60*1000;
        }
        expiresTime.setTime(expiresTime.getTime() + persistPeriod);
        res.cookie('userinfo', JSON.stringify(userInfo), {maxAge: persistPeriod, httpOnly: false, expires: expiresTime.toGMTString()});
      }
      else {
        code = 402; // wrong password;
        status = 'error';
        data = "密码错误";
      }
    }
    else {
      code = 403;
      status = 'error';
      data = "not activate";
    }

  }
  var response = {
    status: status,
    data: data,
    code: code
  };
  res.json(response);
});

router.get('/verifyLogin', async(req, res) => {
  var seriesInfo;
  var userInfo = req.cookies.userinfo;
  var id;
  try{
    userInfo = JSON.parse(userInfo);
    id = userInfo.id;
    let sql = `SELECT * FROM user WHERE id = '${id}'`;
    var result = await query(sql, null, pool1);
    if (result.length==1) {
      seriesInfo = {status:200, info: userInfo, msg: 'success'};
    } else {
      seriesInfo = {status:401, info: "incorrect id", msg: 'fail'};
    }

  }catch(e) {
    seriesInfo = {status:401, info: "wrong cookies", msg: 'fail'};
  }
    console.log(seriesInfo);
  res.json(seriesInfo);
});

router.post('/register', async(req, res) => {
  var reg_email = req.body.email;
  var reg_pwd = req.body.password;
  var sql = `SELECT * FROM user WHERE username = '${reg_email}'`;
  var result = await query(sql, null, pool1);
  var reg_date = getMysqlDate();
  var response;
  if (result.length != 0) {
      response = {
        status: 'error',
        code : 400,
        data: 'registed'
      };
  } else {
    var activateCode = generateCode();
    console.log(activateCode);
    var insert_sql = `INSERT INTO user (email, password, signup_date, activate, activateCode) VALUES ('${reg_email}', '${reg_pwd}', '${reg_date}', 0, '${activateCode}')`;
    var inResult = await query(insert_sql, null, pool1);
    response = {
      status: 'success',
      code : 200,
      data: 'ok'
    };
    var mailText = `Please verify your account through the link http://www.rikuki.cn/register.html?username=${reg_email}&activateCode=${activateCode}`;
    var mailOptions = {
      from: 'officialrikuki@gmail.com',
      to: `${reg_email}`,
      subject: 'Verify your account on Rikuki',
      text: mailText
    };
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email Sent" + info.response);
      }
    });
  }
  console.log(response);
  res.json(response);
  // res.render('index', {msg: "The activate email has been sent to you, please check your email and verify yourself before next signing in."});
});

router.get('/register.html', async(req, res) => {
  var userMail = req.query.username;
  var activateCode = req.query.activateCode;
  if (userMail && activateCode) {
    var sql = `SELECT * FROM user WHERE email = '${userMail}'`;
    console.log(sql);
    var result = await query(sql, null, pool1);
    console.log(result);
    if (result.length == 0){
      res.render('index', {msg: "无效的网址"});
    } else {
      if (result[0].activateCode != activateCode ) res.end('invalid url');
      else {
        var nowStatus = result[0].activate;
        if (nowStatus==1) {
          res.render('index', {msg: "无效的网址"});
        } else {
          var curId = result[0].id;
          var update_sql = `UPDATE user SET activate = 1 WHERE id = ${curId}`;
          var updateResult = await query(update_sql, null, pool1);
          res.render('index', { msg: `您已经注册成功，以后可以使用${userMail}登陆`});
        }
      }
    }
  } else {
    res.render('index', {msg: "无效的网址"});
  }
});

router.get('/index.html', function(req, res) {
  res.render('index', {msg: "恭喜您注册成功"});
});
module.exports = router;
