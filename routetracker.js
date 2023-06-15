class ROUTETRACKER {
    constructor() {
        this.img = routeTrackerImg;
        this.padding = 25;
        this.scale = (width - this.padding*2) / this.img.width;
        this.img.resize(this.img.width*this.scale, this.img.height*this.scale);
        this.width = width;
        this.height = dice.pos.y;

        this.trackerData = this.getTrackerData();
        this.trackerPos = {x: 0, y: 0};
    }

    draw() {
        fill(100);
        rect(0,0,this.width,this.height);

        image(this.img, this.padding,this.padding);

        for(let y = 0; y < this.trackerData.length; y++) {
            for(let x = 0; x < this.trackerData[y].length; x++) {
                noStroke();
                textAlign(CENTER, CENTER);
                textSize(32);
                fill(0);
                if(this.trackerData[y][x]) text(this.trackerData[y][x], this.padding + (118 + 91.5 * x) * this.scale, this.padding + (39 + 84 * y)* this.scale);
            }
        }
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
            map.moveTruckInit();
            return;
        }

        if(venueType.color == "wild") {
            return;
        }

        while(this.trackerPos.y < 6) {
            if(venueType.id == this.trackerPos.x) {
                this.trackerData[this.trackerPos.y][this.trackerPos.x] = dice.numbers[this.trackerPos.x];
                this.moveTracker();
                map.moveTruckInit();
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