var express = require('express');
var router = express.Router();
const mysql = require('mysql');
var request = require('request');
var JSON = require('JSON');
var Iconv = require('iconv-lite');
var nodemailer = require('nodemailer');
const rp = require('request-promise');
const Promise = require('promise');

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

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "YYmm0607?!vr",
  database: "users"
});

let query = function (sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      if (err) reject(err);
      else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
            console.log(err);
          }
          else resolve(rows)
          connection.release();
        })
      }
    })
  })
}

function sendReq(url) {
  return new Promise(function(resolve, reject) {
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
  var url = "https://api.weibo.com/oauth2/access_token?" + `client_id=1606107874&client_secret=dc58406953c628e820ad3aedfa70a4cf&grant_type=authorization_code&code=${code}&redirect_uri=http://www.rikuki.cn/main.html`;
  var data = {
    client_id: "1606107874",
    client_secret: "dc58406953c628e820ad3aedfa70a4cf",
    grant_type: "authorization_code",
    code: code,
    redirect_uri: "http://www.rikuki.cn/main.html"
  }
  var options = {
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
    var response = await rp(options);
    return Promise.resolve({token: response.access_token, uid: response.uid});
  } catch(err) {
    return Promise.resolve({status: 4000, info: "get token fail"});
  }
}

router.get(['/main.html', '/', '/game'], async(req, res, next) =>{
  console.log(req.query);
  var uid, token, weiboInfo = "";
  var weiboStatus;
  if (req.query.code) {
    var codeRes = await getToken(req.query.code);
    if(codeRes.hasOwnProperty('uid')) {
      uid = codeRes.uid;
      token = codeRes.token;
    } else {
      weiboInfo = codeRes.info;
      weiboStatus = codeRes.status;
    }
  }
  var userInfo = req.cookies.userInfo;
  var _id;
  try{
    userInfo = JSON.parse(userInfo);
    var _id = userInfo._id;
    console.log(uid, _id);
    if (uid && _id) {
      var sql = `SELECT * FROM user WHERE id = '${_id}'`;
      var result = await query(sql);
      console.log(result);
      if (result.length==1) {
        var isweibo = result[0].isweibo;
        console.log(isweibo);
        if (isweibo) {
          weiboStatus = 4002;
          weiboInfo = "you have already assocaited with a weibo account";
        } else {
          console.log(token);
          var update_sql = `UPDATE user SET isweibo = 1, weiboToken = "${token}", uid = ${uid} WHERE id = ${_id}`;
          var updateResult = await query(update_sql);
          weiboStatus = 2000;
          weiboInfo = "your are successfuly assocaited with a weibo account";
        }
      } else {
        weiboStatus = 4003;
        weiboInfo = "current user does not exist";
      }
    } else {
      if (weiboStatus != 4000){
        weiboStatus = 2001;
        weiboInfo = "no request for associating weibo";
      }
    }
  } catch(e) {
    if(!_id){
      userInfo = {
        _id: "",
        _username: ""
      };
    }
    if (uid) {
      weiboStatus = 2002;
      weiboInfo = "no user now but got token";
    } else {
      if (weiboStatus != 4000) {
        weiboStatus = 2003;
        weiboInfo = "no weibo request and no user";
      }
    }
  }
  var weiboRes = {
    status: weiboStatus,
    data: weiboInfo
  };
  console.log(weiboRes);
  if (req.query.title) {
    res.render('game', {userInfo: userInfo});
  }
  else {
    // var weiboRes = {
    //   status: weiboStatus,
    //   data: weiboInfo
    // };
    // console.log(weiboStatus);
    // console.log(weiboInfo);
    // var weiboRes = await waitWeibo;
    res.render('main', {userInfo: userInfo});
  }
  next();
});


router.get('/login.html', function(req, res, next) {
  res.render('login', { title: 'Express'});
  next();
});

router.post('/logout', async(req, res) => {
  var id = req.body.id;
  res.cookie("userInfo", "");
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
  url = "http://45.32.9.29:8000/search.html?keyword=" + encodeURI(req.query.keyword);
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
  var sql = `SELECT * FROM user WHERE username = '${username}'`;
  var status = 'sucess';
  var code = 400;
  var data = "";
  var result = await query(sql);
  if (result.length == 0) {
      status = 'error';
      code = 401;// wrong username;
  }
  else {
    var tmpPwd = result[0].password;
    if (result[0].activate == 1) {
      if (tmpPwd === password) {
        code = 200;
        data = "登陆成功";
        status = 'success'; // verify ok;
        userInfo = {
          _id: result[0].id,
          _username: username
        }
        res.cookie('userInfo', JSON.stringify(userInfo), {maxAge: 900000, httpOnly: true});
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
  console.log(response);
  res.json(response);
});

router.post('/register', async(req, res) => {
  var reg_email = req.body.email;
  var reg_pwd = req.body.password;
  var sql = `SELECT * FROM user WHERE username = '${reg_email}'`;
  var result = await query(sql);
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
    var insert_sql = `INSERT INTO user (username, password, signup_date, activate, activateCode) VALUES ('${reg_email}', '${reg_pwd}', '${reg_date}', 0, '${activateCode}')`;
    var inResult = await query(insert_sql);
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
  return;
});

router.get('/register.html', async(req, res) => {
  var userMail = req.query.username;
  var activateCode = req.query.activateCode;
  if (userMail && activateCode) {
    var sql = `SELECT * FROM user WHERE username = '${userMail}'`;
    var result = await query(sql);
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
          var updateResult = await query(update_sql);
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
