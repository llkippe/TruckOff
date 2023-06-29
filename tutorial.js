class TUTORIAL {
    constructor() {
        this.animation = null;
        this.currentText = null;

        this.explained = [];
    }  

    draw() {
        if(this.currentText) {
        const animT = this.animation.getAnimationTime();
        this.currentText.setOpacity(animT);
        this.currentText.draw();
        }
    }

    createButton(text) {
        if(gamestate != "handle bonuses") this.explained.push(gamestate);
        else this.explained.push(routeTracker.bonuses[0].constructor.name);
        
        this.animation = new ANIMATION(0.5,0,"easeOutCubic");
        this.currentText = new BUTTON(width/2 - width*4/5 /2, routeTracker.posY + routeTracker.height/2, width*4/5,height/15,15,height/25,10,color(255,151,56),color(0,150),color(255),text,function(){});
    }

    updateButton() {
        console.log(gamestate);
        if(this.explained.includes(gamestate)) return;
        if(routeTracker.bonuses.length > 0 && this.explained.includes(routeTracker.bonuses[0].constructor.name)) return;

        if(gamestate == "chose starting position") this.createButton("choose a starting position");
        else if(gamestate == "rerolling dice") this.createButton("chose one dice to reroll");
        else if(gamestate == "route tracking") this.createButton("choose one dice to be used");
        else if(gamestate == "move truck") this.createButton("choose truck position (4 spaces)");
        else if(gamestate == "handle bonuses") {
            console.log(routeTracker.bonuses[0])
            console.log("lol");
            if(routeTracker.bonuses[0] instanceof BRIDGE_BONUS) this.createButton("choose location for a bridge");
            else if(routeTracker.bonuses[0] instanceof GAS_BONUS) this.createButton("choose location for a gas station");
            else if(routeTracker.bonuses[0] instanceof TWOTIMES_BONUS) this.createButton("choose venue for 2x mult");
            else if(routeTracker.bonuses[0] instanceof PROMOTE_VENUE_BONUS) this.createButton("promote a venue type");
            else if(routeTracker.bonuses[0] instanceof MOVEMENT_BONUS) this.createButton("added +1 to your truck range");
            else if(routeTracker.bonuses[0] instanceof REROLL_BONUS) this.createButton("one additional reroll");
            else if(routeTracker.bonuses[0] instanceof MOVESTART_BONUS) this.createButton("choose a new starting position");
        }
    }

    removeCurrentButton() {
        this.currentText = null;
    }
}