class MAP {
    constructor(img) {
        this.img = img;
        this.scale = width/ img.width;
        this.img.resize(img.width*this.scale, img.height*this.scale);
        this.BORDER_X = 60 * this.scale;
        this.BORDER_Y = 50 * this.scale;
        this.GRID_SIZE = (this.img.width - this.BORDER_X*2) / 10;
        
        this.mapData = this.createMapData();
        this.truck = null;
        this.truckLines = [];

        this.warningPos = [];
        this.markedPos = null;
        this.truckPaths = null;

        
        
    }

    draw() {
        image(this.img, 0,height - this.img.height);
        //this.drawGrid();

        
        if(this.truck) this.truck.draw();
        this.drawTruckLines();
        this.drawMarkedPos();
        this.drawTruckPathLocations();
        this.drawWarningPos();
    }

    drawMarkedPos() {
        if(this.markedPos) {
            fill(255, 100);
            noStroke();
            let mousePos = this.gridToMousePosition(this.markedPos);
            circle(mousePos.x + this.GRID_SIZE/2,mousePos.y + this.GRID_SIZE/2, this.GRID_SIZE);
        }
    }

    drawWarningPos() {
        for(let i = 0; i < this.warningPos.length; i++) {
            const mousePos = this.gridToMousePosition(this.warningPos[i]);
            fill(255,0,0,150);
            noStroke();
            circle(mousePos.x + this.GRID_SIZE/2, mousePos.y + this.GRID_SIZE/2, this.GRID_SIZE * 3.0 / 4.0);
        }
    }

    drawGrid() {
        let mapPos = this.getMapPosition();
        
        strokeWeight(3);
        stroke(0);
        for(let i = 0; i < 11; i++) {
            line(mapPos.x, mapPos.y+ i*this.GRID_SIZE, width, mapPos.y + i*this.GRID_SIZE);
            line(mapPos.x + i*this.GRID_SIZE, mapPos.y, mapPos.x + i*this.GRID_SIZE, height);
        }
    }

    drawTruckPathLocations() {
        if(this.truckPaths) {
            
            for (const [key, value] of this.truckPaths.entries()) {
                fill(200, 200, 255, 170);
                noStroke();
                let mousePos = this.gridToMousePosition(value[value.length-1]);
                circle(mousePos.x + this.GRID_SIZE/2,mousePos.y + this.GRID_SIZE/2, this.GRID_SIZE/2);
            }
        }
    }

    drawTruckLines() {
        for(let i = 0; i < this.truckLines.length; i++) {
            stroke(0);
            strokeWeight(5);
            line(this.truckLines[i].fromPos.x + this.GRID_SIZE/2,this.truckLines[i].fromPos.y+ this.GRID_SIZE/2,this.truckLines[i].toPos.x+ this.GRID_SIZE/2,this.truckLines[i].toPos.y+ this.GRID_SIZE/2);
        }
    }





    createMapData() {
        let mapData = [
            ['s',' ',' ',' ',' ','vd',' ','vy4','vw23',' '],
            [' ','vp',' ',' ','vg',' ',' ',' ','vr134',' '],
            [' ',' ','vb3','vy',' ',' ','vb',' ','1',' '],
            ['vp4','23','vr134','vg2',' ',' ','vg','4','vb23',' '],
            [' ','13','vp13','3','3','vy3',' ','vp','14','vd23'],
            ['vd3','1','1','vb1','1','vy14','v2',' ',' ','1'],
            ['vr1',' ',' ',' ',' ','vp4','2',' ',' ',' '],
            [' ',' ',' ','vg3','3','vr4','2','vb',' ','vy'],
            ['vp','vy','4','vw123','13','34','vg2',' ','vr','vp'],
            ['s',' ',' ','vy1','1','vd1',' ',' ','4','s2'],
        ]
        return mapData;
    }

    

    // mouse aswell as touch position
    handleInput(mouseX, mouseY) {
        let gridPos =  this.mouseToGridPosition(mouseX, mouseY);
        if(gamestate == "chose starting position") this.choseStartingPosition(gridPos);
        if(gamestate == "move truck") this.moveTruck(gridPos);
    }

    choseStartingPosition(gridPos) {
        if(this.isStartingPosition(gridPos)) {
            if(JSON.stringify(gridPos) === JSON.stringify(this.markedPos)) {
                this.truck = new TRUCK(truckImg, gridPos);
                this.markedPos = null;
                dice.rollingDiceInit();
            }else this.markedPos = gridPos;
        }
    }

    moveTruckInit() {
        this.truckPaths = this.truck.findPathsToVenues(this.truck.pos);
        gamestate = "move truck";
    }
    moveTruck(gridPos) {
        if(this.isTruckPathPosition(gridPos)) {
            if(JSON.stringify(gridPos) === JSON.stringify(this.markedPos)) {
                this.truck.moveTruck(this.truckPaths.get(JSON.stringify(gridPos)));
                this.markedPos = null;
                this.truckPaths = null;
                this.warningPos = [];
            }else {
                this.markedPos = gridPos;
                const path = this.truckPaths.get(JSON.stringify(gridPos));
                for(let i = 0; i < path.length-1; i++) {
                    if(this.isActiveVenue(path[i])) this.warningPos.push(path[i]);
                }
                
            }
        }
    }

    mouseToGridPosition(mouseX, mouseY) {
        let mapPos = this.getMapPosition();

        mouseX -= mapPos.x;
        mouseY -= mapPos.y;

        let gridPos = {
            x: Math.floor(mouseX / this.GRID_SIZE),
            y: Math.floor(mouseY / this.GRID_SIZE)
        };

        return gridPos;
    }

    gridToMousePosition(gridPos) {
        let mapPos = this.getMapPosition();
        
        let x = gridPos.x * this.GRID_SIZE;
        let y = gridPos.y * this.GRID_SIZE;
        x += mapPos.x;
        y += mapPos.y;

        return {x, y};
    }

    isStartingPosition(gridPos) {
        return this.mapData[gridPos.y][gridPos.x].includes("s")
    }

    isVenue(gridPos) {
        return this.mapData[gridPos.y][gridPos.x].includes("v") ; // wild venues
    }
    isActiveVenue(gridPos) {
        return !this.mapData[gridPos.y][gridPos.x].includes("x") && this.isVenue(gridPos);
    }
    closeVenue(gridPos) {
        if(this.isActiveVenue(gridPos)) this.mapData[gridPos.y][gridPos.x] += "x";
    }

    getVenueType(gridPos) {
        if(!this.isVenue(gridPos)) return null;
        if(this.mapData[gridPos.y][gridPos.x].includes("p")) return {color: "purple", id: 0};
        if(this.mapData[gridPos.y][gridPos.x].includes("y")) return {color: "yellow", id: 1};
        if(this.mapData[gridPos.y][gridPos.x].includes("g")) return {color: "green", id: 2};
        if(this.mapData[gridPos.y][gridPos.x].includes("b")) return {color: "blue", id: 3};
        if(this.mapData[gridPos.y][gridPos.x].includes("r")) return {color: "red", id: 4};
        if(this.mapData[gridPos.y][gridPos.x].includes("g")) return {color: "gray", id: 5};
        if(this.mapData[gridPos.y][gridPos.x].includes("w")) return {color: "wild", id: 6};
    }

    isTruckPathPosition(gridPos) {
        if(this.truckPaths == null) return false;
        return this.truckPaths.has(JSON.stringify(gridPos));
    }

    hasRiverAtSide(gridPos) {
        let sideWithRiver = [];
        if(this.mapData[gridPos.y][gridPos.x].includes("1")) sideWithRiver.push("UP");
        if(this.mapData[gridPos.y][gridPos.x].includes("2")) sideWithRiver.push("LEFT");
        if(this.mapData[gridPos.y][gridPos.x].includes("3")) sideWithRiver.push("DOWN");
        if(this.mapData[gridPos.y][gridPos.x].includes("4")) sideWithRiver.push("RIGHT");
        return sideWithRiver;
    }

    posOutOfGridSize(pos) {
        let outOf = pos.x < 0 || pos.x >= this.mapData[0].length || pos.y < 0 || pos.y >= this.mapData.length;
        return outOf;
    }

    getMapPosition() {
        return {
            x: this.BORDER_X,
            y: this.getRawYPos() + this.BORDER_Y
        };
    }

    getRawYPos() {
        return height - this.img.height;
    }

}