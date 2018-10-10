let sendReq = function sendReq(url) {
  return new Promise((resolve, reject) => {
    $.get(url, function(body) {
      if(typeof(body) == 'string') {
        body = JSON.parse(body);
      }
      if (body.code!=200) reject(body.msg);
      else resolve(body.info);
    });
  });
}

let sendPost = function sendPost(url, body) {
  return new Promise((resolve, reject) => {
    $.post(url, body, function(data) {
      if(typeof(data) == 'string') {
        data = JSON.parse(data);
      }
      if (data.code!=200) reject(data.msg);
      else resolve(data);
    });
  });
}
