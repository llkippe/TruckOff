class ROUTETRACKER {
    constructor() {
        this.routeTrackerImg = routeTrackerImg;
        this.padding = 25;
        this.scale = (width - this.padding*2) / this.routeTrackerImg.width;
        this.routeTrackerImg.resize(this.routeTrackerImg.width*this.scale, this.routeTrackerImg.height*this.scale);
        this.width = width;
        this.height = dice.pos.y;

        this.promoHeight = 150;
        this.promoPadding = 20;
        this.promoImgs = [venuePromo6Img, venuePromo4Img, venuePromo3Img];
        this.promoScale = (this.promoHeight - this.promoPadding*2) / this.promoImgs[0].height;
        for(let i = 0; i < this.promoImgs.length; i++) {
            this.promoImgs[i].resize(this.promoImgs[i].width*this.promoScale,this.promoImgs[i].height*this.promoScale);
        }

        this.trackerData = this.getTrackerData();
        this.trackerPos = {x: 0, y: 0};
    }

    draw() {
        fill(68, 52, 123);
        rect(0,0,this.width,this.height);

        this.drawRouteTracker();
        this.drawVenuePromos();
        drawGradientRect(0, this.height - 20, this.width, 20, color(68, 52, 123), color(225,224,213));

        
    }

    drawVenuePromos() {
        imageMode(CENTER);
        let mousePos = this.getMousePos(0,0);
        image(this.promoImgs[0], mousePos.x, this.padding + this.promoHeight/2);
        mousePos = this.getMousePos(1,0);
        image(this.promoImgs[1], mousePos.x, this.padding + this.promoHeight/2);
        for(let x = 2; x < 6; x++) {
            mousePos = this.getMousePos(x,0);
            image(this.promoImgs[2], mousePos.x, this.padding + this.promoHeight/2);
        }
        imageMode(CORNER);
    }

    drawRouteTracker() {
        image(this.routeTrackerImg, this.padding,this.padding + this.promoHeight);

        for(let y = 0; y < this.trackerData.length; y++) {
            for(let x = 0; x < this.trackerData[y].length; x++) {
                noStroke();
                textAlign(CENTER, CENTER);
                textSize(32);
                fill(0);
                let mousePos = this.getMousePos(x,y);
                if(mousePos.x == 0) mousePos.y += 5 * this.scale;
                if(this.trackerData[y][x]) text(this.trackerData[y][x], mousePos.x, mousePos.y);
            }
        }
    }

    getMousePos(gridX, gridY) {
        const pos = {
            x: this.padding + (118 + 91.5 * gridX) * this.scale,
            y: this.padding + (39 + 84 * gridY)* this.scale + this.promoHeight
        }
        return pos;
    }

    getTrackerData() {
        let data = [];
        for(let i = 0; i < 6; i++) {
            data[i] = [];
        }
        return data;
    }

    handleInput(mouseX, mouseY) {
        let collision = dice.collisionWithDice(mouseX, mouseY);
        if(collision) {
            this.updateRouteTracker({color: "", id: collision});
        }
    }

    routeTrackingInit(venueType) {
        gamestate = "route tracking";
        this.updateRouteTracker(venueType);
    }

    updateRouteTracker(venueType) {
        if(venueType == null) {
            this.trackerData[this.trackerPos.y][this.trackerPos.x] = 'X';
            this.moveTracker();
            dice.rollingDiceInit();
            return;
        }

        if(venueType.color == "wild") {
            return;
        }

        while(this.trackerPos.y < 6) {
            if(venueType.id == this.trackerPos.x) {
                this.trackerData[this.trackerPos.y][this.trackerPos.x] = dice.numbers[this.trackerPos.x];
                this.moveTracker();
                dice.rollingDiceInit();
                break;
            }

            this.moveTracker();
        }
    }



    moveTracker() {
        if(this.trackerPos.y % 2 == 0) this.trackerPos.x++;
        else this.trackerPos.x--;
        if(this.trackerPos.x < 0) {
            this.trackerPos.x = 0;
            this.trackerPos.y ++;
        }else if(this.trackerPos.x > 5) {
            this.trackerPos.x = 5;
            this.trackerPos.y ++;
        }
    }
}