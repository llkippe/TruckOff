class TRUCK {
    constructor(img, gridPos) {
        this.img = img;
        this.img.resize(map.GRID_SIZE, map.GRID_SIZE);

        this.pos = gridPos;

    }

    draw() {
        let mousePos = map.gridToMousePosition(this.pos);
        
        image(this.img, mousePos.x,mousePos.y);
    }



}