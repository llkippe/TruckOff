/*
- ? for bonuses
*/

const ANIMATION_TIME = 1;
let highlightImg;
let warningImg;
let diceHighlight;


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
let animation;
let dollarbonus = 0;

let menu;
let logoImg;



function preload() {
  //fontReg = loadFont("fonts/Font_Bureau_-_Interstate-Regular.otf");
  //fontRegCom = loadFont("fonts/Font_Bureau_-_Interstate-RegularCompressed.otf");
   fontThick = loadFont("fonts/FontBureau.otf");
 // fontThickCom = loadFont("/fonts/Font_Bureau_-_Interstate-BlackCompressed.otf");

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

  highlightImg = loadImage("imgs/highlight4.png");
  warningImg = loadImage("imgs/warning3.png");
  diceHighlight = loadImage("imgs/highlightDice6.png");
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
    routeTracker.drawActiveBonusIcon();
    fill(0)
    text(score, 60, 60);

    if(gamestate == "game ended") {
      const x = width/5.0;
      const y = height * 3.0 / 5.0;
      const w = width * 3.0/5.0;
      const h = height/6;

      const animT = animation.getAnimationTime();
      fill(68, 52, 123, animT*255);
      rect(x,y,w,h,10);
      fill(255, animT*255);
      textAlign(CENTER);
      textSize(50);
      text("You're Score: " + score,x + w/2, y + h*1/4);
      text("tap to start",x + w/2, y + h*3/4);

    }
  }
}


function initGame() {
  menu = new MENU();
  map = new MAP(mapImg);
  dice = new DICE(diceImg4, diceImg6, diceImg8, diceImg10, diceImg12, diceImg20);
  venuePromotions = new VENUEPROMOTIONS();
  routeTracker = new ROUTETRACKER();
  animation = null;
  gamestate = "menu"
  dollarbonus = 0;
  score = 0;
  
 textFont(fontThick);
}

function endOfGameInit() {
  gamestate = "game ended";
  animation = new ANIMATION(2.5, 0.3, "easeOutCubic");
}

function touchEnded() {
  if(gamestate == "game ended") {
    initGame();
  }else if(gamestate == "menu") menu.handleInput(mouseX, mouseY)
  else {

  }

  map.handleInput(mouseX, mouseY);
  
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




