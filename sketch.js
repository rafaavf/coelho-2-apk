const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

var engine, world, ground;
var rope;
var fruit;
var fruitCon;
var bgImg, food, rabbit;
var bunny;
var button;
var blink, eat, sad;
var sound, cutSound, sadSound, eatSound, ballonSound;
var ballon, muteBtn;
var btn2, btn3;
var rope2, rope3;
var fruitCon2, fruitCon3;
var canW, canH;

function preload() {
  bgImg = loadImage("background.png");
  food = loadImage("melon.png");
  rabbit = loadImage("Rabbit-01.png");
  blink = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  eat = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  sad = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");
  sound = loadSound("sound1.mp3");
  cutSound = loadSound("rope_cut.mp3");
  sadSound = loadSound("sad.wav");
  eatSound = loadSound("eating_sound.mp3");
  ballonSound = loadSound("air.wav");


  blink.playing = true;
  eat.playing = true;
  sad.playing = true;

  eat.looping = false;
  sad.looping = false;
}

function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile){
    canW = displayWidth;
    canH = displayHeight;
    createCanvas(displayWidth+80, displayHeight);
  } else {
    canW = windowWidth;
    canH - windowHeight;
    createCanvas(windowWidth,windowHeight);
  }

  
  frameRate(80);

  engine = Engine.create();
  world = engine.world;

  sound.play();
  sound.setVolume(0.5);

  button = createImg("cut_btn.png");
  button.position(30, 40);
  button.size(65, 65);
  button.mouseClicked(drop);

  // ballon = createImg("balloon.png");
  // ballon.position(10, 250);
  // ballon.size(150, 100);
  // ballon.mouseClicked(airBlow);

  muteBtn = createImg("mute.png");
  muteBtn.position(430, 20);
  muteBtn.size(60, 60);
  muteBtn.mouseClicked(mute);

  btn2 = createImg("cut_btn.png");
  btn2.position(330, 35);
  btn2.size(65, 65);
  btn2.mouseClicked(drop2);

  btn3 = createImg("cut_btn.png");
  btn3.position(360, 200);
  btn3.size(65, 65);
  btn3.mouseClicked(drop3);

  ground = new Ground(200, canH, 600, 20);

  rope = new Rope(9, { x: 60, y: 60 });
  rope2 = new Rope(7, { x: 360, y: 65 });
  rope3 = new Rope(4, { x: 390, y: 230 });

  blink.frameDelay = 20;
  sad.frameDelay = 20;
  eat.frameDelay = 20;

  bunny = createSprite(170, 500, 100, 100);
  bunny.addImage(rabbit);
  bunny.scale = 0.27;
  bunny.debug = false;
  bunny.setCollider("circle", 0, 0, 20)

  bunny.addAnimation("blinking", blink);
  bunny.addAnimation("sadding", sad);
  bunny.addAnimation("eating", eat);
  bunny.changeAnimation("blinking");

  var fruitOptions = {
    density: 0.001,
  }

  fruit = Bodies.circle(300, 300, 20, fruitOptions);
  Matter.Composite.add(rope.body, fruit);

  fruitCon = new Link(rope, fruit);
  fruitCon2 = new Link(rope2, fruit);
  fruitCon3 = new Link(rope3, fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  textSize(50);

}

function draw() {
  background("darkblue");
  image(bgImg, 0, 0, displayWidth + 1400, displayHeight + 700);
  ground.display();
  rope.show();
  rope2.show();
  rope3.show();

  if (fruit != null) {
    image(food, fruit.position.x, fruit.position.y, 70, 70);
  }

  if (collide(fruit, bunny) === true) {
    bunny.changeAnimation("eating");
    eatSound.play();
  }

  if (collide(fruit, ground.body) === true) {
    bunny.changeAnimation("sadding");
    sadSound.play();
  }

  Engine.update(engine);
  drawSprites();
}

function drop() {
  cutSound.play();
  rope.break();
  fruitCon.detach();
  fruitCon = null;
}

function drop2() {
  cutSound.play();
  rope2.break();
  fruitCon2.detach();
  fruitCon2 = null;
}

function drop3() {
  cutSound.play();
  rope3.break();
  fruitCon3.detach();
  fruitCon3 = null;
}

function collide(body, sprite) {
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if (d <= 80) {
      World.remove(engine.world, fruit);
      fruit = null;
      return true;
    } else {
      return false;
    }
  }
}

function airBlow() {
  Matter.Body.applyForce(fruit, { x: 0, y: 0 }, { x: 0.02, y: 0 });
  ballonSound.play();
}

function mute() {
  if (sound.isPlaying()) {
    sound.stop();
  } else {
    sound.play();
  }
}