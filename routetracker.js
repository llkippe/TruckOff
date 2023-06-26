class ROUTETRACKER {
    constructor() {
        this.routeTrackerImg = routeTrackerImg;
        this.padding = 15;
        this.scale = (width - this.padding*2) / this.routeTrackerImg.width;
        this.routeTrackerImg.resize(this.routeTrackerImg.width*this.scale, this.routeTrackerImg.height*this.scale);
        this.posY = venuePromotions.height;
        this.width = width;
        this.height = dice.pos.y - this.posY;

        

        this.trackerData = this.getTrackerData();
        this.trackerPos = {x: 0, y: 0};

        this.bonuses = [];
        this.twoTimesBonus = false;

        this.animRouteTracker = !this.fitsRouteTrackerOnScreen(0);
        this.finalOffset = -1;
        this.animation = null;
        this.trackerYBefore = 0;
    }

    draw() {
        fill(68, 52, 123);
        noStroke();
        rect(0,this.posY,this.width,this.height);

        this.drawRouteTracker();

        drawGradientRect(0, this.posY + this.height - this.padding + 8, this.width, this.padding - 8, color(68, 52, 123), color(225,224,213));
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

        

        image(this.routeTrackerImg, this.padding, this.padding + this.posY - yOffset);

        for(let y = 0; y < this.trackerData.length; y++) {
            for(let x = 0; x < this.trackerData[y].length; x++) {
                noStroke();
                textAlign(CENTER, CENTER);
                textSize(32);
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

    routeTrackingInit(venueType, twoTimesBonus) {
        gamestate = "route tracking";
        this.twoTimesBonus = twoTimesBonus;
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
            return;
        }

        while(this.trackerPos.y < 6) {
            if(venueType.id == this.trackerPos.x) {
                let mult = 1;
                if(this.twoTimesBonus) mult = 2;

                this.trackerData[this.trackerPos.y][this.trackerPos.x] = dice.numbers[this.trackerPos.x] * mult;
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
        if(this.trackerPos.y > 5) endOfGameInit();
    }

    handleBonusesInit(trackerPos) {
        let count = 0;
        for(let x = 0; x < 6; x++) {
            if(this.trackerData[trackerPos.y][x] != ' ') count++; 
        }
        if(count == 3) {
            this.addBonusForRow(trackerPos.y);
            console.log(trackerPos.y, this.bonuses);
            gamestate = "handle bonuses";
        }
        count = 0;

        for(let y = 0; y < 6; y++) {
            if(this.trackerData[y][trackerPos.x] != ' ') count++; 
        }
        if(count == 3) {
            this.addBonusForCol(trackerPos.x);
            console.log(trackerPos.y, this.bonuses);
            gamestate = "handle bonuses";
        }
    }

    handleBonusInput(mouseX, mouseY) {
        this.bonuses[0].handleInput(mouseX,mouseY);
    }

    removeFirstBonus() {
        this.bonuses.shift();
        console.log("removed first", this.bonuses);
        if(this.bonuses.length == 0) dice.rollingDiceInit();
    }

    addBonusForRow(y) {
        //if(y == 0) this.bonuses.push(new PROMOTE_VENUE_BONUS());
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
        return this.posY + this.height - this.padding - 10 >= this.posY + this.routeTrackerImg.height - offset;
    }

    calculateScore() {
        score = 0;
        for(let y = 0; y < this.trackerData.length; y++) {
            for(let x = 0; x < this.trackerData[y].length; x++) {
                if(this.trackerData[y][x] != ' ' && this.trackerData[y][x] != 'X') {
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
            if(this.trackerData[y][x] != ' ') number++;
        }
        return number;
    }

    

    


    
}