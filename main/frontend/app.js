var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var size = 15;

//道のでこぼこ
var perm = [];

while (perm.length < 255) {
  while(perm.includes(val = Math.floor(Math.random() * 2 * 255)));
  perm.push(val);
}

var lerp = (a,b,t) => a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2;

var noise = x => {
  x = x * 0.01 % 255;
  return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}

//プレイヤー描画
var player = new function() {
  this.x = c.width / 2;
  this.y = 0;
  this.ySpeed = 0;
  this.rot = 0;
  this.rSpeed = 0;

  this.img = new Image();
  this.img.src = "../images/moto.png";

  this.draw = function() {
    //プレイヤーを動かす
    var p1 = c.height - noise(t + this.x) * 0.25;
    var p2 = c.height - noise(t + 5 + this.x) * 0.25;

    var grounded = 0;

    if(p1 - size > this.y) {
      this.ySpeed += 0.1;
    }else{
      this.ySpeed -= this.y - (p1 - size);
      this.y = p1 - size;

      grounded = 1;
    }

    //ゲームオーバーの設定
    if(!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5){
      playing = false;
      this.rSpeed = 5;
      k.ArrowUp = 1;
      this.x -= speed * 5;
    }

    //プレイヤーの角度を変更
    var angle = Math.atan2((p2 - size) - this.y, (this.x + 5) - this.x);

    this.y += this.ySpeed;

    if(grounded && playing) {
      this.rot -= (this.rot - angle) * 0.5;
      this.rSpeed = this.rSpeed - (angle - this.rot);
    }

    this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.05;
    this.rot -= this.rSpeed * 0.1;

    if(this.rot > Math.PI) this.rot = -Math.PI;
    if(this.rot < -Math.PI) this.rot = Math.PI;


    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.drawImage(this.img, -size, -size, 30, 30);

    ctx.restore();
  }
}

//アニメーションさせる
var t = 0;

//矢印キーで操作
var speed = 0;
//ゲームオーバーの設定
var playing = true;
var k ={ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0};

//キャンバス(水色の背景の部分全部)作成
function loop() {
  speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.1;
  t += 5 * speed;
  ctx.fillStyle = "rgb(255, 160, 80)";
  ctx.fillRect(0,0,c.width,c.height);

  ctx.fillStyle="black"

  ctx.beginPath();
  ctx.moveTo(0, c.height);

  for(var i = 0; i < c.width; i++) {
    ctx.lineTo(i, c.height - noise(t + i) * 0.25);
  }

  ctx.lineTo(c.width, c.height);

  ctx.fill();

  player.draw();
  requestAnimationFrame(loop);
}

onkeydown = d => k[d.key] = 1;
onkeyup = d => k[d.key] = 0;


loop();