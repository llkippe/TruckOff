class BONUS {
    constructor(img) {
        this.animation = new ANIMATION(2.5,0,"easePlateau");
        this.img = img;
        this.size = width/4;
        console.log(img);
    }

    start() {
        this.animation = new ANIMATION(2.5,0,"easePlateau");
    }

    handleInput(mouseX, mouseY) {

    }

    draw() {
        const linT = this.animation.getLinearTime();
        if(linT < 1){
            const animT = this.animation.getAnimationTime();
            const scale = lerp(0.5, 1.5, animT);
            const opacity = lerp(0,255,animT)
            const imgSize = this.size * scale;
            tint(255,opacity);
            image(this.img, width/2 - imgSize/2,  height/2 - imgSize/2, imgSize, imgSize);
            tint(255,255);
        }else{
            this.act();
        }
    }

    act() {
        routeTracker.removeFirstBonus();
    }
}

class BRIDGE_BONUS extends BONUS {
    constructor() {
        super(bridgeBonusImg);
        this.selectedPos = null
    }

    handleInput(mouseX, mouseY) {
        const gridPos = map.mouseToGridPosition(mouseX, mouseY);
        console.log(gridPos);
        if(!map.posInGrid(gridPos)) return;

        if(this.selectedPos == null) {
            this.selectedPos = gridPos;
            return;
        }

        if(map.bridgeAllowed(this.selectedPos, gridPos)) {
            const positions = [this.selectedPos, gridPos];
            positions.sort((a, b) => a.x - b.x);
            positions.sort((a, b) => a.y - b.y);

            map.addBridge(positions[0], positions[1]);
            routeTracker.removeFirstBonus();
            return;
        }

        this.selectedPos = gridPos;
    }

    act() {
        if(this.selectedPos) map.highlightPosition(this.selectedPos);
    }
}

class GAS_BONUS extends BONUS {
    constructor() {
        super(gasBonusImg);
        this.selectedPos = null
    }

    handleInput(mouseX, mouseY) {
        const gridPos = map.mouseToGridPosition(mouseX, mouseY);
        console.log(gridPos);
        if(!map.posInGrid(gridPos)) return;

        if(this.selectedPos == null || JSON.stringify(this.selectedPos) != JSON.stringify(gridPos)) {
            if(!map.isVenue(gridPos)) this.selectedPos = gridPos;
            return;
        }

        if(!map.isVenue(gridPos)) {
            map.addGasStation(gridPos);
            routeTracker.removeFirstBonus();
            return;
        }

        if(!map.isVenue(gridPos)) this.selectedPos = gridPos;
    }

    act() {
        if(this.selectedPos) map.highlightPosition(this.selectedPos);
    }
}

class TWOTIMES_BONUS extends BONUS {
    constructor() {
        super(twotimesBonusImg);
        this.selectedPos = null
    }

    handleInput(mouseX, mouseY) {
        const gridPos = map.mouseToGridPosition(mouseX, mouseY);
        console.log(gridPos);
        if(!map.posInGrid(gridPos)) return;

        if(this.selectedPos == null || JSON.stringify(this.selectedPos) != JSON.stringify(gridPos)) {
            if(map.isActiveVenue(gridPos)) this.selectedPos = gridPos;
            return;
        }

        if(map.isActiveVenue(gridPos)) {
            map.add2xBonus(gridPos);
            routeTracker.removeFirstBonus();
            return;
        }

        if(map.isActiveVenue(gridPos)) this.selectedPos = gridPos;
    }

    act() {
        if(this.selectedPos) map.highlightPosition(this.selectedPos);
    }
}

class PROMOTE_VENUE_BONUS extends BONUS {
    constructor() {
        super(promoteVenueBonusImg);
    }

    handleInput(mouseX, mouseY){
        const promo = venuePromotions.collisionWithPromo(mouseX,mouseY);
        if(promo != null) {
            console.log(promo)
            venuePromotions.promoteVenue(promo);
            routeTracker.removeFirstBonus();
            venuePromotions.highlights = false;
        }
    } 
    act() {
        venuePromotions.highlights = true;
    }
}

class MOVEMENT_BONUS extends BONUS {
    constructor() {
        super(movementBonusImg);
        map.truck.maxAllowedMoves++;
    }
}

class REROLL_BONUS extends BONUS {
    constructor() {
        super(rerollBonusImg);
        dice.availableRerolls = 2;
    }
}
class MOVESTART_BONUS extends BONUS {
    constructor() {
        super(movestartBonusImg);
        this.selectedPos = null;
        map.selectStartingPos();
    }

    handleInput(mouseX, mouseY) {
        const gridPos = map.mouseToGridPosition(mouseX, mouseY);
        if(!map.posInGrid(gridPos)) return;

        if(this.selectedPos == null || JSON.stringify(this.selectedPos) != JSON.stringify(gridPos)) {
            if(map.isStartingPosition(gridPos)) this.selectedPos = gridPos;
            return;
        }

        if(map.isStartingPosition(gridPos)) {
            map.truck.pos = gridPos;
            routeTracker.removeFirstBonus();
            return;
        }

        if(map.isStartingPosition(gridPos)) this.selectedPos = gridPos;
    }

    act() {
        if(this.selectedPos) map.highlightPosition(this.selectedPos);
    }
}

class FIVEDOLLAR_BONUS extends BONUS {
    constructor() {
        super(fivedollarBonusImg);
    }
    act() {
        dollarbonus+=5;
        routeTracker.calculateScore();
        routeTracker.removeFirstBonus();
    }
}

