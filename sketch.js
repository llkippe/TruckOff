/*
- add venues moved over  
- add truck drawings
  - add warning when moving over venue
  
  - fix route tracker
  - add venue promotions
  - add bonuses
  - add bridge
*/

let fontReg;
let fontRegCom;
let fontThick;
let fontThickCom;

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
let venuePromo6Img;
let venuePromo4Img;
let venuePromo3Img;
let routeTracker;

let gamestate = "chose starting position";


let animation;


function preload() {
  fontReg = loadFont("/fonts/Font_Bureau_-_Interstate-Regular.otf");
  fontRegCom = loadFont("/fonts/Font_Bureau_-_Interstate-RegularCompressed.otf");
  fontThick = loadFont("/fonts/Font_Bureau_-_Interstate-Black.otf");
  fontThickCom = loadFont("/fonts/Font_Bureau_-_Interstate-BlackCompressed.otf");

  mapImg = loadImage("/imgs/map2.png");
  truckImg = loadImage("/imgs/Trucks-08.png");
  diceImg4 = loadImage("/imgs/D4.png");
  diceImg6 = loadImage("/imgs/D6.png");
  diceImg8 = loadImage("/imgs/D8.png");
  diceImg10 = loadImage("/imgs/D10.png");
  diceImg12 = loadImage("/imgs/D12.png");
  diceImg20 = loadImage("/imgs/D20.png");
  routeTrackerImg = loadImage("/imgs/routePlanerOnly.png");
  venuePromo3Img = loadImage("/imgs/venuePromo3.png");
  venuePromo4Img = loadImage("/imgs/venuePromo4.png");
  venuePromo6Img = loadImage("/imgs/venuePromo6.png");

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
  textFont(fontThick);
}

function touchEnded() {
  map.handleInput(mouseX, mouseY);
  if(gamestate == "rerolling dice") dice.handleInput(mouseX, mouseY);
  if(gamestate == "route tracking") routeTracker.handleInput(mouseX,mouseY);
  event.preventDefault();
}


function lerp(a, b, t) {
  return a + (b - a) * t;
}

function drawGradientRect(x, y, w, h, color1, color2) {
  // Draw the gradient rectangle
  for (let j = y; j < y + h; j++) {
    let inter = (j - y) / h;
    let gradientColor = lerpColor(color1, color2, inter);
    stroke(gradientColor);
    strokeWeight(2);
    line(x, j, x + w, j);
  }
}


