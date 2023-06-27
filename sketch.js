/*
bugs:
  - when promotingh d8 d6 is promoted
*/


const ANIMATION_TIME = 1;
let selectedImg;
let confirmedImg;
let warningImg;
let rerollImg;
let promoHighlightImg;


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
let bonusOverlayRowImg;
let bonusOverlayColImg;
let routeTracker;

let venuePromotions;

let gamestate = "menu";

let score = 0;
let animation;
let dollarbonus = 0;
let restartButton;
let scoreButton;

let menu;
let logoImg;
let mainLogoImg;



function preload() {
  //fontReg = loadFont("fonts/Font_Bureau_-_Interstate-Regular.otf");
  //fontRegCom = loadFont("fonts/Font_Bureau_-_Interstate-RegularCompressed.otf");
 // fontThickCom = loadFont("/fonts/Font_Bureau_-_Interstate-BlackCompressed.otf");
  fontThick = loadFont("fonts/FontBureau.otf");

  logoImg = loadImage("imgs/Logo-03.png");
  mainLogoImg = loadImage("imgs/Logo-04.png");
  mapImg = loadImage("imgs/mapNoWater.png");

  truck1Img = loadImage("imgs/Trucks-08.png");
  truck2Img = loadImage("imgs/Trucks-21.png");
  truck3Img = loadImage("imgs/Trucks-22.png");
  truck4Img = loadImage("imgs/Trucks-29.png");
  truck5Img = loadImage("imgs/Trucks-36.png");
  truck6Img = loadImage("imgs/Trucks-43.png");

  diceImg4 = loadImage("imgs/D4.png");
  diceImg6 = loadImage("imgs/D6.png");
  diceImg8 = loadImage("imgs/D8.png");
  diceImg10 = loadImage("imgs/D10.png");
  diceImg12 = loadImage("imgs/D12.png");
  diceImg20 = loadImage("imgs/D20.png");

  routeTrackerImg = loadImage("imgs/routePlanerOnly.png");
  bonusOverlayRowImg = loadImage("imgs/bonusOverlayRow.png");
  bonusOverlayColImg = loadImage("imgs/bonusOverlayCol.png");
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

  selectedImg = loadImage("imgs/selected.png")
  confirmedImg = loadImage("imgs/confirmed.png");
  warningImg = loadImage("imgs/warning.png");
  rerollImg = loadImage("imgs/diceHighlight.png");
  promoHighlightImg = loadImage("imgs/highlightDice6.png");
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
    routeTracker.drawBonusOverlayCol();
    fill(255)
    textAlign(CENTER);
    textSize(width/20);
    text(score, width/18, width/20);

    if(gamestate == "game ended") {
      drawGameEnded();
    }
  }
}


function initGame() {
  menu = new MENU();
  map = new MAP();
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
  restartButton = new BUTTON(width/2 - width/5, height*5/7, width*2/5,height/15,15,height/30,6,color(50),color(244,131,36),color(255),"Restart",function(){initGame()});
  scoreButton = new BUTTON(width/2 - width*3/5 /2, height/2, width*3/5,height/13,15,height/20,6,color(50),color(68, 52, 123),color(255),"You're Score: " + score,function(){});
}



function drawGameEnded() {
  const animT = animation.getAnimationTime();

  fill(0,40*animT);
  rect(0,0,width,height);

  scoreButton.setOpacity(animT*255);
  scoreButton.draw();

  restartButton.setOpacity(animT*255);
  restartButton.draw();
}

function touchEnded() {
  if(gamestate == "game ended") {
    restartButton.handleInput(mouseX,mouseY);
  }else if(gamestate == "menu") menu.handleInput(mouseX, mouseY)
  else {
    map.handleInput(mouseX, mouseY);
    routeTracker.overlayButton.handleInput(mouseX,mouseY);
    if(gamestate == "rerolling dice") dice.handleInput(mouseX, mouseY);
    if(gamestate == "route tracking") routeTracker.handleInput(mouseX,mouseY);
    if(gamestate == "handle bonuses") routeTracker.handleBonusInput(mouseX, mouseY);
  }

  
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

function collisionRectRect(x1, y1, w1, h1, x2, y2, w2, h2) {
  return (x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1) ? false : true;
}




