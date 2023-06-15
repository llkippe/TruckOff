let truckImg; 

let mapImg;
let map;

let diceImg4;
let diceImg6;
let diceImg8;
let diceImg10;
let diceImg12;
let diceImg20;
let dice;

let routeTrackerImg;
let routeTracker;

let gamestate = "chose starting position";

function preload() {
  mapImg = loadImage("/imgs/map2.png");
  truckImg = loadImage("/imgs/Trucks-08.png");
  diceImg4 = loadImage("/imgs/D4.png");
  diceImg6 = loadImage("/imgs/D6.png");
  diceImg8 = loadImage("/imgs/D8.png");
  diceImg10 = loadImage("/imgs/D10.png");
  diceImg12 = loadImage("/imgs/D12.png");
  diceImg20 = loadImage("/imgs/D20.png");
  routeTrackerImg = loadImage("/imgs/routePlanerOnly.png");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  initGame();
}

function draw() {
  background(150);
  routeTracker.draw();
  map.draw();
  dice.draw();
  

}


function initGame() {
  map = new MAP(mapImg);
  dice = new DICE(diceImg4, diceImg6, diceImg8, diceImg10, diceImg12, diceImg20);
  routeTracker = new ROUTETRACKER();
}

function touchEnded() {
  map.handleInput(mouseX, mouseY);
  if(gamestate == "rolling dice") dice.handleInput(mouseX, mouseY);
  if(gamestate == "route tracking") routeTracker.handleInput(mouseX,mouseY);
  event.preventDefault();
}
