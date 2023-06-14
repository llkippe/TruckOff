class ROUTETRACKER {
    constructor() {
        this.img = routeTrackerImg;
        this.padding = 25;
        this.scale = (width - this.padding*2) / this.img.width;
        this.img.resize(this.img.width*this.scale, this.img.height*this.scale);
        this.width = width;
        this.height = dice.pos.y;

        this.trackerData = this.getTrackerData();
    }

    draw() {
        fill(100);
        rect(0,0,this.width,this.height);

        image(this.img, this.padding,this.padding);
    }

    getTrackerData() {
        let data = [6];
        for(let i = 0; i < 6; i++) {
            data[i] = [6];
        }
        return data;
    }

    routeTrackingInit(venueType) {
        gamestate = "route tracking";
        console.log(venueType);
    }
}