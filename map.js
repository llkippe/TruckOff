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

        this.markedPos = null;
        
    }

    draw() {
        image(this.img, 0,height - this.img.height);
        this.drawGrid();

        if(this.truck) this.truck.draw();
        if(this.markedPos) {
            fill(255, 100);
            noStroke();
            let mousePos = this.gridToMousePosition(this.markedPos);
            circle(mousePos.x + this.GRID_SIZE/2,mousePos.y + this.GRID_SIZE/2, this.GRID_SIZE);
        }
    }

    createMapData() {
        let mapData = [
            ['s',' ',' ',' ',' ','v',' ','vr','wlb',' '],
            [' ','v',' ',' ','v',' ',' ',' ','vtbr',' '],
            [' ',' ','vb','v',' ',' ','v',' ','t',' '],
            ['vr','lb','vtbr','vl',' ',' ','v','r','vlb',' '],
            [' ','tb','vtb','b','b','vb',' ','v','tr','vlb'],
            ['vb','t','t','vt','t','vtr','vl',' ',' ','t'],
            ['vt',' ',' ',' ',' ','vr','l',' ',' ',' '],
            [' ',' ',' ','vb','b','vr','l','v',' ','v'],
            ['v','v','r','wtlb','tb','br','vl',' ','v','v'],
            ['s',' ',' ','vt','t','vt',' ',' ','r','sl'],
        ]
        return mapData;
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

    // mouse aswell as touch position
    handleInput(mouseX, mouseY) {
        let gridPos =  this.mouseToGridPosition(mouseX, mouseY);
        if(gamestate == "chose starting position") this.choseStartingPosition(gridPos);
        
    }

    choseStartingPosition(gridPos) {
        if(this.isStartingPosition(gridPos)) {
            console.log(this.markedPos, gridPos)
            if(JSON.stringify(gridPos) === JSON.stringify(this.markedPos)) {
                this.truck = new TRUCK(truckImg, gridPos);
                this.markedPos = null;
                gamestate = "roll dice";
            }else this.markedPos = gridPos;
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
        return false;//this.mapData[gridPos.y][gridPos.x].includes("v");
    }

    hasRiverAtSide(gridPos) {
        let sideWithRiver = [];
        //console.log(gridPos);
        if(this.mapData[gridPos.y][gridPos.x].includes("t")) sideWithRiver.push("UP");
        if(this.mapData[gridPos.y][gridPos.x].includes("l")) sideWithRiver.push("LEFT");
        if(this.mapData[gridPos.y][gridPos.x].includes("b")) sideWithRiver.push("DOWN");
        if(this.mapData[gridPos.y][gridPos.x].includes("r")) sideWithRiver.push("RIGHT");
        return sideWithRiver;
    }

    posOutOfGridSize(pos) {
       // console.log("out of" + pos, pos.x, pos.y)
        let outOf = pos.x < 0 || pos.x >= this.mapData[0].length || pos.y < 0 || pos.y >= this.mapData.length;
        //console.log(outOf);
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