var express = require('express');
var router = express.Router();
var util = require('util');
var request = require('request');
var JSON = require('JSON');
var path = require('path');
const rp = require('request-promise');
const Promise = require('promise');
router.use(express.static(__dirname + '../public'));
const multer = require("multer");
const fs = require('fs');

const upload = multer({
  dest: path.join(__dirname, '../', 'static/images/' )
});

const genPicName = function generateCode() {
  var  x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
  var  tmp = "";
  var timestamp = new Date().getTime();
  for (var i=0; i<10; i++)  {
    tmp  +=  x.charAt(Math.ceil(Math.random()*100000000)%x.length);
  }
  return tmp;
}

let sendReq = function sendReq(url) {
  return new Promise((resolve, reject) => {
    request(url, function(err, resp, body) {
      if (err) reject(err);
      else resolve(body);
    });
  });
}

router.get(['/main.html', '/'], async(req, res) => {
  res.render('gtd_main');
});
router.get('/blog.html', async(req, res) => {
  res.render('gtd_blog');
});
router.get('/editBlog.html', async(req, res) => {
  res.render('edit');
});
router.get("/triffle.html", (req,res) => {
  res.render('gtd_twitter.html');
});
router.get("/daily.html", (req,res) => {
  res.render('gtd_daily.html');
});

router.post('/newBlog', async(req, res)=> {
  let url = "http://www.rikuki.cn/api/gtd/newBlog"
  let options = {
    method: 'POST',
    uri: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
      'Content-Type': 'application/json'
    },
    body: {
      uid: req.body.uid,
      title: req.body.title,
      subtitle: req.body.subtitle,
      content: req.body.content,
      type: req.body.type,
    },
    json: true
  };
  let response = await rp(options);
  res.json(response);
});

router.get('/getBlog', async(req, res)=> {
  let uid = req.query.id;
  let page = req.query.page;
  let url = `http://www.rikuki.cn/api/gtd/getBlog?uid=${uid}&page=${page}`
  let promise = await sendReq(url);
  let items = JSON.parse(promise);
  res.json(items);
});

router.get('/blogContent.html', async(req, res)=> {
  res.render("gtd_content");
});

router.post('/uploadIMG', upload.single("file" ), async(req, res) => {
  let tempPath = req.file.path;
  let ext = path.extname(req.file.originalname).toLowerCase();
  let filename = genPicName() + ext;
  let targetPath = path.join(__dirname, '../', 'static/images/', filename);
  console.log(targetPath);
  fs.rename(tempPath, targetPath, err => {
    if (err) {
      res
      .status(400)
      .contentType("text/plain")
      .end("ERR when uploading images")
    }
    else {
      res
        .status(200)
        .contentType("text/plain")
        .end("File uploaded!");
    }
  });
});

module.exports = router;
