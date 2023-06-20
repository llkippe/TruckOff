class BONUS {
    constructor(img) {
        this.animation = new ANIMATION(2.5 * ANIMATION_TIME,0,"easePlateau");
        this.img = img;
        this.size = width/4;
        console.log(img);
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
            map.addBridge(this.selectedPos,gridPos);
            routeTracker.removeFirstBonus();
            return;
        }

        this.selectedPos = gridPos;
    }

    act() {
        if(this.selectedPos) {
            const mousePos = map.gridToMousePosition(this.selectedPos);
            circle(mousePos.x,mousePos.y,30);
        }
    }
}

class GAS_BONUS extends BONUS {
    constructor() {
        super(bridgeBonusImg);
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
            console.log(this.selectedPos, gridPos);
            routeTracker.removeFirstBonus();
            return;
        }

        if(!map.isVenue(gridPos)) this.selectedPos = gridPos;
    }

    act() {
        if(this.selectedPos) {
            const mousePos = map.gridToMousePosition(this.selectedPos);
            circle(mousePos.x,mousePos.y,30);
        }
    }
}

class TWOTIMES_BONUS extends BONUS {
    constructor() {
        super(twotimesBonusImg);
    }
}

class PROMOTE_VENUE_BONUS extends BONUS {
    constructor() {
        super(promoteVenueBonusImg);
    }
}

class MOVEMENT_BONUS extends BONUS {
    constructor() {
        super(movementBonusImg);
    }
}

class REROLL_BONUS extends BONUS {
    constructor() {
        super(rerollBonusImg);
    }
}
class MOVESTART_BONUS extends BONUS {
    constructor() {
        super(bridgeBonusImg);
        this.selectedPos = null
    }

    handleInput(mouseX, mouseY) {
        const gridPos = map.mouseToGridPosition(mouseX, mouseY);
        console.log(gridPos);
        if(!map.posInGrid(gridPos)) return;

        if(this.selectedPos == null || JSON.stringify(this.selectedPos) != JSON.stringify(gridPos)) {
            if(map.isStartingPosition(gridPos)) this.selectedPos = gridPos;
            return;
        }

        if(map.isStartingPosition(gridPos)) {
            console.log(this.selectedPos, gridPos);
            map.truck.pos = gridPos;
            routeTracker.removeFirstBonus();
            return;
        }

        if(map.isStartingPosition(gridPos)) this.selectedPos = gridPos;
    }

    act() {
        if(this.selectedPos) {
            const mousePos = map.gridToMousePosition(this.selectedPos);
            circle(mousePos.x,mousePos.y,30);
        }
    }
}

class FIVEDOLLAR_BONUS extends BONUS {
    constructor() {
        super(fivedollarBonusImg);
    }
}

