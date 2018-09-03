var canvas = document.getElementById("myCanvas");
var brush = canvas.getContext('2d');
var winWidth, winHeight;
if (window.innerWidth) {
  winWidth = window.innerWidth;
}
else if ((document.body) && (document.body.clientWidth)) {
  winWidth = document.body.clientWidth;
}
winHeight = canvas.height;


var distance = 175;
function Wall(x, y, dx, dy, color) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.color = color;
  this.distance = 1;
  this.initialX = x;

  this.draw = function () {
    // brush.beginPath();
    brush.fillStyle = this.color;
    brush.fillRect(this.x, this.y, this.dx, this.dy);
  };
  this.moveL = function () {
    this.x -= this.distance;
  }
  this.reCovery = function() {
    this.x = this.initialX;
  }
}

function Ball(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;

  this.draw = function () {
    brush.beginPath();
    brush.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
    brush.strokeStyle = 'black';
    brush.fillStyle = this.color;
    brush.fill();
    brush.stroke();
  };
}

function drawStar(cx,cy,spikes,outerRadius,innerRadius){
    var rot=Math.PI/2*3;
    var x=cx;
    var y=cy;
    var step=Math.PI/spikes;

    brush.beginPath();
    brush.moveTo(cx,cy-outerRadius);
    for(i=0;i<spikes;i++){
      x=cx+Math.cos(rot)*outerRadius;
      y=cy+Math.sin(rot)*outerRadius;
      brush.lineTo(x,y);
      rot+=step;

      x=cx+Math.cos(rot)*innerRadius;
      y=cy+Math.sin(rot)*innerRadius;
      brush.lineTo(x,y);
      rot+=step;
    }
    brush.lineTo(cx,cy-outerRadius);
    brush.closePath();
    brush.lineWidth=5;
    brush.strokeStyle='blue';
    brush.stroke();
    brush.fillStyle='skyblue';
    brush.fill();
}

var walls = [];
var initialX = 150;
var randomY = 150;
var randomHeight = 0;
var finalY = winHeight - 100;
var numberOfWall = 40;
while(walls.length < numberOfWall){
  randomHeight = Math.floor(Math.random()*250) + 150;
  var wall = new Wall(initialX, randomY, 50, randomHeight, "#FD7400");
  wall.draw();
  walls.push(wall);
  wall = new Wall(initialX, randomY+randomHeight+75, 50, finalY-(randomY+randomHeight+75), "FD7400");
  wall.draw();
  walls.push(wall);
  initialX = initialX + distance;
  randomY = Math.floor(Math.random()*50) + 50;
}
function loadWalls() {
  for(var i=0; i<walls.length; i++){
    walls[i].draw();
  }
}
var ball = new Ball(30, walls[0].y+walls[0].dy+30, 5, "#E39279");
var raf = null;
var running = false;
var controlFlag = 0;
var speedx = 0.7;
var speedy = 0.3;

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function moveWall(flag) {
  for(x in walls) {
    if (!flag) walls[x].moveL();
    if (flag) walls[x].reCovery();
  }
}

function ballPace() {
  // if (running){
  brush.clearRect(0,0, canvas.width, canvas.height);
  ball.x += speedx;
  switch (controlFlag) {
    case 0:
        ball.y += speedy;
      break;
    case 1:
        ball.y += speedy;
        break;
    case 2:
        ball.y -= speedy;
        break;
    default:
        break;
  }
  if (walls[walls.length - 1].x >= winWidth - distance) {
    moveWall(0);
  }
  loadWalls();
  ball.draw();
  // for (index in walls) {
  //   if ((walls[index].x - ball.x)<ball.radius) && ((walls[index].y-ball.y)<ball.radius || (walls[index].y)) {
  //     alert("you lose");
  //     brush.clearRect(0,0, canvas.width, canvas.height);
  //     loadWalls();
  //     ball.x = 30;
  //     ball.y = walls[0].y+ walls[0].dy+30;
  //     ball.draw();
  //   }
  // }
  if (ball.x>=canvas.width || ball.x<=30 || ball.y<=30 || ball.y>=canvas.height) {
    ball.x = 30;
    ball.y = walls[0].y+ walls[0].dy+30;
    controlFlag = 0;
    moveWall(1);
    window.cancelAnimationFrame(raf);
    setTimeout('raf = window.requestAnimationFrame(ballPace)', 2000);
    // raf = window.requestAnimationFrame(ballPace);
  } else {
    raf = window.requestAnimationFrame(ballPace);
  }
}
//
// canvas.addEventListener('mouseover', function(e) {
//   controlFlag = 0;
//   // running = true;
//   raf = window.requestAnimationFrame(ballPace);
// });
canvas.addEventListener('click', function(evt) {
  if (raf!=null) {
    window.cancelAnimationFrame(raf);
    raf = null;
  }
  var mousePos = getMousePos(canvas, evt);
  if (mousePos.y >= ball.y) {
    controlFlag = 1;
  }else {
    controlFlag = 2;
  }
  speedy += 0.2;
  if (speedy>1) speedy = 0.3;
  raf = window.requestAnimationFrame(ballPace);
});

ball.draw();
// brush.fillStyle = "#FF0000";
// brush.fillRect(0,0,150,75);
