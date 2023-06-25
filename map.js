class MAP {
    constructor(img) {
        this.img = img;
        this.scale = width / img.width;
        this.img.resize(img.width * this.scale, img.height * this.scale);
        this.BORDER_X = 60 * this.scale;
        this.BORDER_Y = 40 * this.scale;
        this.GRID_SIZE = (this.img.width - this.BORDER_X * 2) / 10;

        this.mapData = this.createMapData();
        this.truck = null;
        this.truckLines = [];

        this.warningPos = [];
        this.markedPos = null;
        this.truckPaths = null;

        this.bridges = [];
        this.gasStations = [];
    }

    draw() {
        fill(150, 185, 199);
        noStroke();
        rect(0, this.getRawYPos(), this.img.width, this.img.height);
        this.drawBridges();
        image(this.img, 0, this.getRawYPos());
        //this.drawGrid();


        if (this.truck) this.truck.draw();
        this.drawTruckLines();
        this.drawMarkedPos();
        this.drawTruckPathLocations();
        this.drawWarningPos();
        this.drawGasStations();
    }

    drawMarkedPos() {
        if (this.markedPos) {
            fill(255, 100);
            noStroke();
            let mousePos = this.gridToMousePosition(this.markedPos);
            circle(mousePos.x + this.GRID_SIZE / 2, mousePos.y + this.GRID_SIZE / 2, this.GRID_SIZE);
        }
    }

    drawWarningPos() {
        for (let i = 0; i < this.warningPos.length; i++) {
            const mousePos = this.gridToMousePosition(this.warningPos[i]);
            fill(255, 0, 0, 150);
            noStroke();
            circle(mousePos.x + this.GRID_SIZE / 2, mousePos.y + this.GRID_SIZE / 2, this.GRID_SIZE * 3.0 / 4.0);
        }
    }

    drawGrid() {
        let mapPos = this.getMapPosition();

        strokeWeight(3);
        stroke(0);
        for (let i = 0; i < 11; i++) {
            line(mapPos.x, mapPos.y + i * this.GRID_SIZE, width, mapPos.y + i * this.GRID_SIZE);
            line(mapPos.x + i * this.GRID_SIZE, mapPos.y, mapPos.x + i * this.GRID_SIZE, height);
        }
    }

    drawTruckPathLocations() {
        if (this.truckPaths) {

            for (const [key, value] of this.truckPaths.entries()) {
                this.highlightPosition(value[value.length - 1]);
            }
        }
    }

    drawTruckLines() {
        for (let i = 0; i < this.truckLines.length; i++) {
            stroke(80);
            strokeWeight(10);
            strokeCap(ROUND);
            line(this.truckLines[i].fromPos.x + this.GRID_SIZE / 2, this.truckLines[i].fromPos.y + this.GRID_SIZE / 2, this.truckLines[i].toPos.x + this.GRID_SIZE / 2, this.truckLines[i].toPos.y + this.GRID_SIZE / 2);
        }
    }

    drawBridges() {
        for (const bridge of this.bridges) {
            const mousePosFrom = this.gridToMousePosition(bridge.fromPos);
            const mouseToFrom = this.gridToMousePosition(bridge.toPos);

            fill(246, 244, 233);
            noStroke();

            if (mousePosFrom.x < mouseToFrom.x) {
                const bridgeWidth = mouseToFrom.x - mousePosFrom.x;
                const bridgeHeight = this.GRID_SIZE / 4;
                rect(mousePosFrom.x + this.GRID_SIZE / 2, mousePosFrom.y + (this.GRID_SIZE - bridgeHeight) / 2, bridgeWidth, bridgeHeight);
            }else{
                const bridgeWidth = this.GRID_SIZE / 4;
                const bridgeHeight = mouseToFrom.y - mousePosFrom.y;
                rect(mousePosFrom.x + (this.GRID_SIZE - bridgeWidth) / 2, mousePosFrom.y + this.GRID_SIZE / 2 , bridgeWidth, bridgeHeight);
            }
        }
    }

    drawGasStations() {
        for(const gs of this.gasStations) {
            const mousePos = this.gridToMousePosition(gs.pos);
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(this.GRID_SIZE * 3 / 4);
            fill(0);
            
            text("G", mousePos.x + this.GRID_SIZE/2, mousePos.y + this.GRID_SIZE/2);
        }
    }

    highlightPosition(gridPos) {
        fill(200, 200, 255, 170);
        noStroke();
        let mousePos = this.gridToMousePosition(gridPos);
        circle(mousePos.x + this.GRID_SIZE / 2, mousePos.y + this.GRID_SIZE / 2, this.GRID_SIZE / 2);
    }


    createMapData() {
        let mapData = [
            ['s', ' ', ' ', ' ', ' ', 'vd', ' ', 'vy4', 'vw23', ' '],
            [' ', 'vp', ' ', ' ', 'vg', ' ', ' ', ' ', 'vr134', '2'],
            [' ', ' ', 'vb3', 'vy', ' ', ' ', 'vb', ' ', '1', ' '],
            ['vg4', '23', 'vr134', 'vg2', ' ', ' ', 'vg', '4', 'vb23', ' '],
            [' ', '13', 'vp13', '3', '3', 'vy3', ' ', 'vp', '14', 'vd23'],
            ['vd3', '1', '1', 'vb1', '1', 'vy14', 'vp2', ' ', ' ', '1'],
            ['vr1', ' ', ' ', ' ', ' ', 'vp4', '2', ' ', ' ', ' '],
            [' ', ' ', ' ', 'vg3', '3', 'vr4', '2', 'vb', ' ', 'vy'],
            ['vp', 'vy', '4', 'vw123', '13', '34', 'vg2', ' ', 'vr', 'vp'],
            ['s', ' ', ' ', 'vy1', '1', 'vd1', ' ', ' ', '4', 's2'],
        ]
        return mapData;
    }



    // mouse aswell as touch position
    handleInput(mouseX, mouseY) {
        let gridPos = this.mouseToGridPosition(mouseX, mouseY);
        if (!this.posInGrid(gridPos)) return;
        if (gamestate == "chose starting position") this.choseStartingPosition(gridPos);
        if (gamestate == "move truck") this.moveTruck(gridPos);
    }

    choseStartingPosition(gridPos) {
        if (this.isStartingPosition(gridPos)) {
            if (JSON.stringify(gridPos) === JSON.stringify(this.markedPos)) {
                this.truck = new TRUCK(gridPos);
                this.markedPos = null;
                dice.rollingDiceInit();
            } else this.markedPos = gridPos;
        }
    }

    moveTruckInit() {
        this.truckPaths = this.truck.findPathsToVenues(this.truck.pos);
        gamestate = "move truck";
    }
    moveTruck(gridPos) {
        if (this.isTruckPathPosition(gridPos)) {
            if (JSON.stringify(gridPos) === JSON.stringify(this.markedPos)) {
                this.truck.moveTruck(this.truckPaths.get(JSON.stringify(gridPos)));
                this.markedPos = null;
                this.truckPaths = null;
                this.warningPos = [];
            } else {
                this.markedPos = gridPos;
                const path = this.truckPaths.get(JSON.stringify(gridPos));
                for (let i = 0; i < path.length - 1; i++) {
                    if (this.isActiveVenue(path[i])) this.warningPos.push(path[i]);
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

        return { x, y };
    }

    isStartingPosition(gridPos) {
        if (!this.posInGrid(gridPos)) return false;
        return this.mapData[gridPos.y][gridPos.x].includes("s")
    }

    isVenue(gridPos) {
        if (!this.posInGrid(gridPos)) return false;
        return this.mapData[gridPos.y][gridPos.x].includes("v"); // wild venues
    }
    isActiveVenue(gridPos) {
        if (!this.posInGrid(gridPos)) return false;
        return !this.mapData[gridPos.y][gridPos.x].includes("x") && this.isVenue(gridPos);
    }
    isPathOverActiveVenue(path) {
        for (let i = 0; i < path.length - 1; i++) {
            if (this.isActiveVenue(path[i])) return true;
        }
        return false;
    }

    closeVenue(gridPos) {
        if (!this.posInGrid(gridPos)) return;
        if (this.isActiveVenue(gridPos)) this.mapData[gridPos.y][gridPos.x] += "x";
    }

    getVenueType(gridPos) {
        if (!this.isActiveVenue(gridPos)) return null;
        if (this.mapData[gridPos.y][gridPos.x].includes("p")) return { color: "purple", id: 0 };
        if (this.mapData[gridPos.y][gridPos.x].includes("y")) return { color: "yellow", id: 1 };
        if (this.mapData[gridPos.y][gridPos.x].includes("g")) return { color: "green", id: 2 };
        if (this.mapData[gridPos.y][gridPos.x].includes("b")) return { color: "blue", id: 3 };
        if (this.mapData[gridPos.y][gridPos.x].includes("r")) return { color: "red", id: 4 };
        if (this.mapData[gridPos.y][gridPos.x].includes("d")) return { color: "dark", id: 5 };
        if (this.mapData[gridPos.y][gridPos.x].includes("w")) return { color: "wild", id: 6 };
    }

    isTruckPathPosition(gridPos) {
        if (this.truckPaths == null) return false;
        return this.truckPaths.has(JSON.stringify(gridPos));
    }

    hasRiverAtSide(gridPos) {
        let sideWithRiver = [];
        if (this.mapData[gridPos.y][gridPos.x].includes("1")) sideWithRiver.push("UP");
        if (this.mapData[gridPos.y][gridPos.x].includes("2")) sideWithRiver.push("LEFT");
        if (this.mapData[gridPos.y][gridPos.x].includes("3")) sideWithRiver.push("DOWN");
        if (this.mapData[gridPos.y][gridPos.x].includes("4")) sideWithRiver.push("RIGHT");
        return sideWithRiver;
    }

    bridgeAllowed(gridPos1, gridPos2) {
        const sidesWithRiver = this.hasRiverAtSide(gridPos1);
        for (const side of sidesWithRiver) {
            const newPos = this.truck.moveDirection(gridPos1, side);
            if (JSON.stringify(newPos) == JSON.stringify(gridPos2)) return true;
        }
        return false;
    }

    addBridge(gridPos1, gridPos2) {
        this.bridges.push({ fromPos: gridPos1, toPos: gridPos2 });
        if (gridPos1.y == gridPos2.y) {
            this.mapData[gridPos1.y][gridPos1.x] += "4";
            this.mapData[gridPos2.y][gridPos2.x] += "2";
        } else if (gridPos1.x == gridPos2.x) {
            this.mapData[gridPos1.y][gridPos1.x] += "3";
            this.mapData[gridPos2.y][gridPos2.x] += "1";
        }
    }

    addGasStation(gridPos) {
        this.gasStations.push({pos: gridPos});
    }

    isGasStation(gridPos) {
        for(const gs of this.gasStations) {
            if(JSON.stringify(gs.pos) == JSON.stringify(gridPos)) return true;
        }
        return false;
    }

    isPathOverGasStation(path) {
        for (let i = 0; i < path.length - 1; i++) {
            if (this.isGasStation(path[i])) return true;
        }
        return false;
    }

    add2xBonus(gridPos) {
        this.mapData[gridPos.y][gridPos.x] += "t";
    }

    is2xBonus(gridPos) {
        if (!this.posInGrid(gridPos)) return false;
        return this.mapData[gridPos.y][gridPos.x].includes("t");
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

    posInGrid(gridPos) {
        return gridPos.x >= 0 && gridPos.x <= 10 && gridPos.y >= 0 && gridPos.y <= 10;
    }

}