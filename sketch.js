/*
- fix bridge into map
*/

const ANIMATION_TIME = 0.1;

let fontReg;
let fontRegCom;
let fontThick;
let fontThickCom;


let chosenTruckImg;
let truck1Img;
let truck2Img;
let truck3Img;
let truck4Img;
let truck5Img;
let truck6Img; 

let mapImg;
let map;

let diceImg4;
let diceImg6;
let diceImg8;
let diceImg10;
let diceImg12;
let diceImg20;
let dice;

let bridgeBonusImg;
let gasBonusImg;
let twotimesBonusImg;
let promoteVenueBonusImg;
let movementBonusImg;
let rerollBonusImg;
let movestartBonusImg;
let fivedollarBonusImg;

let venuePromo6Img;
let venuePromo4Img;
let venuePromo3Img;

let routeTrackerImg;
let routeTracker;

let venuePromotions;

let gamestate = "menu";

let score = 0;
let dollarbonus = 0;

let menu;
let logoImg;



function preload() {
  fontReg = loadFont("fonts/Font_Bureau_-_Interstate-Regular.otf");
  fontRegCom = loadFont("fonts/Font_Bureau_-_Interstate-RegularCompressed.otf");
  fontThick = loadFont("fonts/Font_Bureau_-_Interstate-Black.otf");
  fontThickCom = loadFont("/fonts/Font_Bureau_-_Interstate-BlackCompressed.otf");

  mapImg = loadImage("imgs/mapNoWater.png");
  truck1Img = loadImage("imgs/Trucks-08.png");
  truck2Img = loadImage("imgs/Trucks-21.png");
  truck3Img = loadImage("imgs/Trucks-22.png");
  truck4Img = loadImage("imgs/Trucks-29.png");
  truck5Img = loadImage("imgs/Trucks-36.png");
  truck6Img = loadImage("imgs/Trucks-43.png");
  logoImg = loadImage("imgs/Logo-03.png");
  diceImg4 = loadImage("imgs/D4.png");
  diceImg6 = loadImage("imgs/D6.png");
  diceImg8 = loadImage("imgs/D8.png");
  diceImg10 = loadImage("imgs/D10.png");
  diceImg12 = loadImage("imgs/D12.png");
  diceImg20 = loadImage("imgs/D20.png");
  routeTrackerImg = loadImage("imgs/routePlanerOnly.png");
  venuePromo3Img = loadImage("imgs/venuePromo3.png");
  venuePromo4Img = loadImage("imgs/venuePromo4.png");
  venuePromo6Img = loadImage("imgs/venuePromo6.png");
  bridgeBonusImg = loadImage("imgs/drawBridge.png");
  gasBonusImg = loadImage("imgs/gasStation.png");
  twotimesBonusImg = loadImage("imgs/twotimes.png");
  promoteVenueBonusImg = loadImage("imgs/promoteVenue.png");
  movementBonusImg = loadImage("imgs/movement.png");
  rerollBonusImg = loadImage("imgs/reroll.png");
  movestartBonusImg = loadImage("imgs/movestart.png");
  fivedollarBonusImg = loadImage("imgs/fivedollarbonus.png");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  initGame();
}

function draw() {
  background(150,185,199);

  if(gamestate == "menu") {
    menu.draw();
  }else{
    routeTracker.draw();
    map.draw();
    dice.draw();
    routeTracker.drawActiveBonus();
    venuePromotions.draw();
  }

  

  fill(0)
  text(score, 60, 60);
}


function initGame() {
  menu = new MENU();
  map = new MAP(mapImg);
  dice = new DICE(diceImg4, diceImg6, diceImg8, diceImg10, diceImg12, diceImg20);
  venuePromotions = new VENUEPROMOTIONS();
  routeTracker = new ROUTETRACKER();
  
  textFont(fontThick);
}

function endOfGameInit() {
  gamestate = "game ended";
}

function touchEnded() {
  map.handleInput(mouseX, mouseY);
  if(gamestate == "menu") menu.handleInput(mouseX, mouseY);
  if(gamestate == "rerolling dice") dice.handleInput(mouseX, mouseY);
  if(gamestate == "route tracking") routeTracker.handleInput(mouseX,mouseY);
  if(gamestate == "handle bonuses") routeTracker.handleBonusInput(mouseX, mouseY);
  event.preventDefault();
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




