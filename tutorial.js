class TUTORIAL {
    constructor() {
        this.animation = null;
        this.currentText = null;
        this.explained = [];
    }

    draw() {
        if (tutorialActive) {
            if (this.currentText) {
                const animT = this.animation.getAnimationTime();
                this.currentText.setOpacity(animT);
                this.currentText.draw();
            }
        }
    }

    createButton(text) {
        if (gamestate != "handle bonuses") this.explained.push(gamestate);
        else this.explained.push(routeTracker.bonuses[0].constructor.name);

        this.animation = new ANIMATION(0.5, 0, "easeOutCubic");
        this.currentText = new BUTTON(width / 2 - width * 4 / 5 / 2, routeTracker.posY + routeTracker.height / 2, width * 4 / 5, height / 15, 15, height / 25, 10, color(255, 151, 56), color(0, 150), color(255), text, function () { });
    }

    updateButton() {
        if (this.explained.includes(gamestate)) return;
        if (routeTracker.bonuses.length > 0 && this.explained.includes(routeTracker.bonuses[0].constructor.name)) return;

        if (gamestate === "chose starting position")
            this.createButton("Choose starting position");
        else if (gamestate === "rerolling dice")
            this.createButton("Reroll one dice");
        else if (gamestate === "route tracking")
            this.createButton("Select dice to use");
        else if (gamestate === "move truck")
            this.createButton("Move truck (4 spaces)");
        else if (gamestate === "handle bonuses") {
            const bonus = routeTracker.bonuses[0];
            if (bonus instanceof BRIDGE_BONUS)
                this.createButton("Place bridge");
            else if (bonus instanceof GAS_BONUS)
                this.createButton("Build gas station");
            else if (bonus instanceof TWOTIMES_BONUS)
                this.createButton("Choose venue for 2x mult");
            else if (bonus instanceof PROMOTE_VENUE_BONUS)
                this.createButton("Promote venue type");
            else if (bonus instanceof MOVEMENT_BONUS)
                this.createButton("Increase truck range (+1)");
            else if (bonus instanceof REROLL_BONUS)
                this.createButton("Use additional reroll");
            else if (bonus instanceof MOVESTART_BONUS)
                this.createButton("Choose new starting position");
        }

    }

    removeCurrentButton() {
        this.currentText = null;
    }
}