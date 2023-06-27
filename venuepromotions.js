class VENUEPROMOTIONS {
    constructor() {
        this.width = width;
        this.height = 100;
        this.padding = 0;
        this.imgs = [venuePromo6Img, venuePromo4Img, venuePromo3Img];
        this.scale = (this.height - this.padding*2) / this.imgs[0].height;
        this.data = [];
        this.highlights = false;
    }

    draw() {
        fill(68, 52, 123);
        noStroke();
        rect(0,0,this.width,this.height);
        this.drawVenuePromos();
        this.drawPromotions();
    }

    drawVenuePromos() {
        imageMode(CENTER);
        for(let x = 0; x < 6; x++) {
            const mousePos = this.getMousePosOfPromo(x);
            const imgIndex = Math.min(x, 2);
            tint(190);
            if(this.highlights) image(diceHighlight, mousePos.x, mousePos.y, this.imgs[imgIndex].height * this.scale,this.imgs[imgIndex].height * this.scale);
            tint(255);
            image(this.imgs[imgIndex], mousePos.x, mousePos.y, this.imgs[imgIndex].width*this.scale,this.imgs[imgIndex].height*this.scale);
        }
        imageMode(CORNER);
    }

    drawPromotions() {
        for(let i = 0; i < this.data.length; i++) {
            if(this.data[i]) {
                let positions = this.getCrossPosition(i, this.data[i]);
                for(const pos of positions) {
                    fill(0);
                    circle(pos.x, pos.y, 47 * this.scale)
                }
            }
        }
    }


    getCrossPosition(x, number) {
        let positions = [];
        let mousePos = this.getMousePosOfPromo(x);
        if(x == 0) {
            positions.push({x: mousePos.x - 28 * this.scale, y: mousePos.y - 46 * this.scale});
            positions.push({x: mousePos.x + 25 * this.scale, y: mousePos.y - 46 * this.scale});

            positions.push({x: mousePos.x - 27 * this.scale, y: mousePos.y + 6 * this.scale});
            positions.push({x: mousePos.x + 25 * this.scale, y: mousePos.y + 6 * this.scale});

            positions.push({x: mousePos.x - 26 * this.scale, y: mousePos.y + 58 * this.scale})
            positions.push({x: mousePos.x + 26 * this.scale, y: mousePos.y + 58 * this.scale});
        } else if(x == 1) {
            positions.push({x: mousePos.x - 26 * this.scale, y: mousePos.y - 28 * this.scale});
            positions.push({x: mousePos.x + 26 * this.scale, y: mousePos.y - 28 * this.scale});

            positions.push({x: mousePos.x - 26 * this.scale, y: mousePos.y + 24 * this.scale});
            positions.push({x: mousePos.x + 26 * this.scale, y: mousePos.y + 24 * this.scale});
        } else {
            positions.push({x: mousePos.x - 1 * this.scale, y: mousePos.y - 21 * this.scale});
            positions.push({x: mousePos.x - 27 * this.scale, y: mousePos.y + 24 * this.scale});
            positions.push({x: mousePos.x + 27 * this.scale, y: mousePos.y + 24 * this.scale});
        }

        positions.splice(number);
        return positions;
    }

    getMousePosOfPromo(x) {
        let mousePos = routeTracker.getMousePos(x,0);
        mousePos.y = this.height/2;
        return mousePos;
    }

    collisionWithPromo(mouseX, mouseY) {
        for(let x = 0; x < 6; x++) {
            const mousePos = this.getMousePosOfPromo(x);
            const imgIndex = Math.min(x, 2);
            if(dist(mousePos.x, mousePos.y, mouseX, mouseY) <= this.imgs[imgIndex].height/2) {
                return x;
            }
        }
        return null;
    }

    promoteVenue(promo) {
        if(this.data[promo]) {
            this.data[promo]+=2;
            if(promo == 0) this.data[promo] = Math.min(6, this.data[promo]);
            else if(promo == 1) this.data[promo] = Math.min(4, this.data[promo]);
            else this.data[promo] = Math.min(3, this.data[promo]);
        }else this.data[promo] = 2;

        routeTracker.calculateScore();
    }
}