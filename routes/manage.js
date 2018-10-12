var express = require('express');
var router = express.Router();
// const mysql = require('mysql');
var request = require('request');
var JSON = require('JSON');
var path = require('path');
const rp = require('request-promise');
const Promise = require('promise');
router.use(express.static(__dirname + '../public'));

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
  // let uid = req.query.id;
  // let page = req.query.page;
  // let url = `http://www.rikuki.cn/api/gtd/getBlog?uid=${uid}&page=${page}`
  // let promise = await sendReq(url);
  // let items = JSON.parse(promise);
  res.render("gtd_content");
});

module.exports = router;
