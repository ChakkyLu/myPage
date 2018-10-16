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
      if (data.code>=400) reject(data.msg);
      else resolve(data);
    });
  });
}

let drawPie = function drawPie(data, colors, canvas) {

  var drawPieChart = function(data, colors) {
    // var canvas = document.getElementById('pie');

    var ctx = canvas.getContext('2d');
    var x = (canvas.width - 150 )/ 2;
    var y = canvas.height / 2;

    let color, startAngle, endAngle;
    let total = getTotal(data);

    for(let i = 0; i < data.length; i++) {

      color = colors[i];
      startAngle = calculateStart(data, i, total);
      endAngle = calculateEnd(data, i, total);

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.moveTo(x, y);
      ctx.arc(x, y, y-15, startAngle, endAngle);
      ctx.fill();
      ctx.fillRect(x+80, y-i*30, 20, 20);
      ctx.fillText(data[i].label + " - " + data[i].value, x+80+30, y - i * 30 + 10);

    }
  };

  var calculatePercent = function(value, total) {
    return (value / total * 100).toFixed(2);
  };

  var getTotal = function(data) {
    var sum = 0;
    for(let i=0; i<data.length; i++) {
      sum += data[i].value;
    }
    return sum;
  };

  var calculateStart = function(data, index, total) {
    if(index === 0) {
      return 0;
    }
    return calculateEnd(data, index-1, total);
  };

  var calculateEndAngle = function(data, index, total) {
    var angle = data[index].value / total * 360;
    var inc = ( index === 0 ) ? 0 : calculateEndAngle(data, index-1, total);
    return ( angle + inc );
  };

  var calculateEnd = function(data, index, total) {
    return degreeToRadians(calculateEndAngle(data, index, total));
  };

  var degreeToRadians = function(angle) {
    return angle * Math.PI / 180
  }

  drawPieChart(data, colors);
}
