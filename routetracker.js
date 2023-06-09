class ROUTETRACKER {
    constructor() {
        this.padding = 15;
        this.scale = (width - this.padding*2) / routeTrackerImg.width;
        this.posY = venuePromotions.height;
        this.width = width;
        this.height = dice.pos.y - this.posY;

        

        this.trackerData = this.getTrackerData();
        this.trackerPos = {x: 0, y: 0};

        this.bonuses = [];
        this.bonusMult = 1;

        this.animRouteTracker = !this.fitsRouteTrackerOnScreen(0);
        this.finalOffset = -1;
        this.animation = null;
        this.trackerYBefore = 0;

        this.drawBonusOverlay = false;
        const size = width/15;
        this.overlayButton = new BUTTON(this.width - size - 20,this.height-size-20 + this.posY,size,size,15,10,6,color(50),color(244,131,36),color(255),"?",function() {routeTracker.drawBonusOverlay = !routeTracker.drawBonusOverlay});
    }

    draw() {
        fill(68, 52, 123);
        noStroke();
        rect(0,this.posY,this.width,this.height);

        this.drawRouteTracker();
        this.overlayButton.draw();

        //drawGradientRect(0, this.posY + this.height - this.padding + 8, this.width, this.padding - 8, color(68, 52, 123), color(0,0,0));
        stroke(0);
        strokeWeight(5);
        line(0, this.posY + this.height, this.width, this.posY + this.height)
    }

    

    drawRouteTracker() {
        let yOffset = 0;

        if(this.animRouteTracker) {
            yOffset = (this.trackerPos.y-1) * 84 * this.scale;
            if(this.animation) {
                const animT = this.animation.getAnimationTime();
                yOffset = lerp((this.trackerPos.y-2) * 84 * this.scale, (this.trackerPos.y-1) * 84 * this.scale, animT);
                if(this.animation.animationDone()) this.animation = null;
            }

            if(yOffset < 0) yOffset = 0;

            if(this.fitsRouteTrackerOnScreen(yOffset) && this.finalOffset == -1) {
                this.finalOffset = yOffset;
            }

            if(this.finalOffset != -1) yOffset = this.finalOffset;
        }

        

        image(routeTrackerImg, this.padding, this.padding + this.posY - yOffset, routeTrackerImg.width * this.scale, routeTrackerImg.height * this.scale);
        if(this.drawBonusOverlay) image(bonusOverlayRowImg, this.padding, this.padding + this.posY - yOffset, bonusOverlayRowImg.width * this.scale, bonusOverlayRowImg.height * this.scale);
        

        for(let y = 0; y < this.trackerData.length; y++) {
            for(let x = 0; x < this.trackerData[y].length; x++) {
                noStroke();
                textAlign(CENTER, CENTER);
                textSize(26 * this.scale);
                fill(0);
                let mousePos = this.getMousePos(x,y);
                if(mousePos.x == 0) mousePos.y += 5 * this.scale;
                if(this.trackerData[y][x]) text(this.trackerData[y][x], mousePos.x, mousePos.y - yOffset);
            }
        }


       
    }
    drawActiveBonus() {
        if(this.bonuses.length > 0) {
            this.bonuses[0].draw();
        }
    }
    drawActiveBonusIcon() {
        imageMode(CENTER);
        if(this.bonuses.length > 0) {
            const img = this.bonuses[0].img;
            const size = venuePromotions.height - 10;
            image(img, width - size/2, venuePromotions.height/2, size, size);
        }
        imageMode(CORNER);
    }
    drawBonusOverlayCol() {
        const w = bonusOverlayColImg.width * this.scale;
        const h = bonusOverlayColImg.height * this.scale;
        if(this.drawBonusOverlay) {
            image(bonusOverlayColImg,this.padding, this.padding + this.posY + this.height , w,h);
        }
    }

    getMousePos(gridX, gridY) {
        const pos = {
            x: this.padding + (118 + 91.5 * gridX) * this.scale,
            y: this.padding + (39 + 84 * gridY)* this.scale + this.posY
        }
        return pos;
    }

    getTrackerData() {
        let data = [];
        for(let i = 0; i < 6; i++) {
            data[i] = [' ',' ',' ',' ',' ',' '];
        }
        return data;
    }

    handleInput(mouseX, mouseY) {
        let collision = dice.collisionWithDice(mouseX, mouseY);
        if(collision) {
            this.updateRouteTracker({color: "", id: collision});
        }
    }

    routeTrackingInit(venueType, bonusMult) {
        gamestate = "route tracking";
        this.bonusMult = bonusMult;
        this.updateRouteTracker(venueType);
    }
    updateRouteTracker(venueType) {
        if(venueType == null) {
            this.trackerData[this.trackerPos.y][this.trackerPos.x] = 'X';
            this.handleBonusesInit(this.trackerPos);
            this.moveTracker();
            dice.rollingDiceInit();
            return;
        }

        if(venueType.color == "wild") {
            tutorial.updateButton();
            return;
        }

        while(this.trackerPos.y < 6) {
            if(venueType.id == this.trackerPos.x) {
                this.trackerData[this.trackerPos.y][this.trackerPos.x] = dice.numbers[this.trackerPos.x] * this.bonusMult;
                this.handleBonusesInit(this.trackerPos);
                this.moveTracker();
                if(gamestate == "route tracking") dice.rollingDiceInit(); // and gamestate != "handle bonuses"
                break;
            }

            this.moveTracker();
        }

        this.calculateScore();
    }
    moveTracker() {
        if(this.trackerPos.y % 2 == 0) this.trackerPos.x++;
        else this.trackerPos.x--;
        if(this.trackerPos.x < 0) {
            this.trackerPos.x = 0;
            this.trackerPos.y ++;
            this.animation = new ANIMATION(1.5, 0, "easeInOutCubic");
        }else if(this.trackerPos.x > 5) {
            this.trackerPos.x = 5;
            this.trackerPos.y ++;
            this.animation = new ANIMATION(1.5, 0, "easeInOutCubic");
        }
        if(this.trackerPos.y > 5 && this.bonuses.length == 0) endOfGameInit();
    }

    handleBonusesInit(trackerPos) {
        let count = 0;
        for(let x = 0; x < 6; x++) {
            if(this.saleEntried(x,trackerPos.y)) count++; 
        }
        if(count == 3) {
            this.addBonusForRow(trackerPos.y);
            gamestate = "handle bonuses";
            tutorial.updateButton();
        }
        count = 0;

        for(let y = 0; y < 6; y++) {
            if(this.saleEntried(trackerPos.x,y)) count++; 
        }
        if(count == 3) {
            this.addBonusForCol(trackerPos.x);
            gamestate = "handle bonuses";
            tutorial.updateButton();
        }
    }

    handleBonusInput(mouseX, mouseY) {
        this.bonuses[0].handleInput(mouseX,mouseY);
    }

    removeFirstBonus() {
        this.bonuses.shift();
        tutorial.removeCurrentButton();
        if(this.bonuses.length == 0) {
            if(this.trackerPos.y > 5) endOfGameInit();
            else dice.rollingDiceInit();
            return;
        }
        this.bonuses[0].start();
        tutorial.updateButton();
    }

    addBonusForRow(y) {
        //if(y == 0) this.bonuses.push(new MOVESTART_BONUS());
        if(y == 0) this.bonuses.push(new BRIDGE_BONUS());
        else if(y == 1) this.bonuses.push(new PROMOTE_VENUE_BONUS());
        else if(y == 2) this.bonuses.push(new GAS_BONUS());
        else if(y == 3) this.bonuses.push(new TWOTIMES_BONUS());
        else if(y == 4) this.bonuses.push(new MOVESTART_BONUS());
        else if(y == 5) this.bonuses.push(new FIVEDOLLAR_BONUS());
         
    }
    addBonusForCol(x) {
        if(x == 0) {
            this.bonuses.push(new PROMOTE_VENUE_BONUS());
            this.bonuses.push(new FIVEDOLLAR_BONUS);
        } 
        else if(x == 1) {
            this.bonuses.push(new GAS_BONUS);
            this.bonuses.push(new FIVEDOLLAR_BONUS);
        }
        else if(x == 2) this.bonuses.push(new TWOTIMES_BONUS());
        else if(x == 3) this.bonuses.push(new MOVEMENT_BONUS());
        else if(x == 4) this.bonuses.push(new REROLL_BONUS());
        else if(x == 5) this.bonuses.push(new BRIDGE_BONUS());  
    }


    fitsRouteTrackerOnScreen(offset) {
        const limit = this.posY+ this.height - this.padding;
        const realSize = this.posY + (routeTrackerImg.height * this.scale) + this.padding*2 - offset;

        return limit >= realSize;
    }

    calculateScore() {
        score = 0;
        for(let y = 0; y < this.trackerData.length; y++) {
            for(let x = 0; x < this.trackerData[y].length; x++) {
                if(this.saleEntried(x,y)) {
                    score += this.trackerData[y][x];
                }
            }
        }
        score += dollarbonus;

        for(let i = 0; i < venuePromotions.data.length; i++) {
            if(venuePromotions.data[i]) {
                score += parseInt(venuePromotions.data[i] * this.entriesInCol(i));
            }
        }
    }

    entriesInCol(x) {
        let number = 0;
        for(let y = 0; y < this.trackerData.length; y++) {
            if(this.saleEntried(x,y)) number++;
        }
        return number;
    }

    saleEntried(x,y) {
        return this.trackerData[y][x] != ' ' && this.trackerData[y][x] != 'X';
    }

    

    


    
}