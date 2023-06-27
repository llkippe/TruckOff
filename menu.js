class MENU {
    constructor() {
        this.truckImgs = [truck1Img,truck2Img,truck3Img,truck4Img,truck5Img,truck6Img];
    }

    draw() {
        fill(68, 52, 123);
        rect(0,0,width,height);

        const scale = width/ mainLogoImg.width;

        image(mainLogoImg, 0,height/20, mainLogoImg.width * scale, mainLogoImg.height * scale);
        
        for(let i = 0; i < this.truckImgs.length; i++) {
            const pos = this.getPositionOfTruck(i);
            const size = this.getSizeOfTruck();
            image(this.truckImgs[i], pos.x, pos.y, size, size);
        }
    }

    getPositionOfTruck(i) {
        let x = i % 2;
        let y = i % 3;
        return {x: x * width/3 + width/5, y:  y * height/6 + height/3};
    }

    getSizeOfTruck() {
        return width/4;
    }

    handleInput(mouseX, mouseY) {
        for(let i = 0; i < this.truckImgs.length; i++) {
            const pos = this.getPositionOfTruck(i);
            const size = this.getSizeOfTruck();
            if(dist(pos.x + size/2, pos.y + size/2, mouseX, mouseY) <= size/2) {
                chosenTruckImg = this.truckImgs[i];
                map.choseStartingPositionInit();
                return;
            }
        }
    }


}