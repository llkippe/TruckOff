let truckImg; 

let mapImg;
let map;

let gamestate = "chose starting position";

function preload() {
  mapImg = loadImage("/imgs/map2.png");
  truckImg = loadImage("/imgs/Trucks-08.png");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  initGame();
}

function draw() {
  background(150);
  map.draw();
}


function initGame() {
  map = new MAP(mapImg);
}

function touchEnded() {
  map.handleInput(mouseX, mouseY);
  event.preventDefault();
}