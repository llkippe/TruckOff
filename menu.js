class MENU {
    constructor() {
        this.truckImgs = [truck1Img, truck2Img, truck3Img, truck4Img, truck5Img, truck6Img];
        const w = width * 2.3 / 5;
        this.tutorialButton = new BUTTON(width / 2 - w / 2, height * 8.7 / 10, w, height / 18, 15, height / 40, 6, color(50), color(244, 131, 36), color(255), "Tutorial", function () { });
        this.tutorialButton.clickedFkt = this.tutorialButtonClicked;
    }

    draw() {
        fill(68, 52, 123);
        rect(0, 0, width, height);

        const scale = width / mainLogoImg.width;

        image(mainLogoImg, 0, 0, mainLogoImg.width * scale, mainLogoImg.height * scale);

        for (let i = 0; i < this.truckImgs.length; i++) {
            const pos = this.getPositionOfTruck(i);
            const size = this.getSizeOfTruck();
            image(this.truckImgs[i], pos.x, pos.y, size, size);
        }

        this.tutorialButton.draw();

        textAlign(CENTER);
        noStroke();
        fill(245);
        textSize(height / 50);
        text("Collect as many sales as you can.", width / 2, mainLogoImg.height * scale);


    }

    getPositionOfTruck(i) {
        let x = i % 2;
        let y = i % 3;
        return { x: x * width / 3 + width / 5, y: y * height / 6 + height / 3 };
    }

    getSizeOfTruck() {
        return width / 4;
    }

    handleInput(mouseX, mouseY) {
        this.tutorialButton.handleInput(mouseX, mouseY);

        for (let i = 0; i < this.truckImgs.length; i++) {
            const pos = this.getPositionOfTruck(i);
            const size = this.getSizeOfTruck();
            if (dist(pos.x + size / 2, pos.y + size / 2, mouseX, mouseY) <= size / 2) {
                chosenTruckImg = this.truckImgs[i];
                map.choseStartingPositionInit();
                return;
            }
        }
    }


    tutorialButtonClicked() {
        tutorialActive = !tutorialActive;
        if (tutorialActive == false) {
            this.setFillColor(color(120));
            this.setStrokeColor(color(50));
            this.setTextColor(color(180));
        } else {
            this.setFillColor(color(244, 131, 36));
            this.setStrokeColor(color(50));
            this.setTextColor(color(255));
        }
    }

}