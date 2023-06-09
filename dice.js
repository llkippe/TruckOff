class DICE {
    constructor() {
        this.width = width;
        this.height = height/13;
        this.pos = {
            x: 0,
            y: map.getRawYPos() - this.height
        }

        this.imgs = [];
        this.imgs.push(diceImg4,diceImg6,diceImg8,diceImg10,diceImg12,diceImg20);

        this.numbers = [];
        this.numbers.push(4,6,8,10,12,20);

        this.diceRerolled = 0;
        this.availableRerolls = 1;

        this.animation = null;
        this.previousStep = 0;
        this.stepSize = 20
        this.diceToReroll = 0;
        this.animationDuration = 1;
    }

    draw() {
        
        noStroke();
        
        fill(225,224,213);
        fill(68, 52, 123);
        rect(this.pos.x, this.pos.y, this.width, this.height);
        if(!routeTracker.drawBonusOverlay ) {
        for (let i = 0; i < this.imgs.length; i++) {
            this.drawDice(i, this.numbers[i]);
        }
    }
    }

    drawDice(dice, number) {
        if(this.animation && (gamestate == "rolling dice" || gamestate == "rerolling dice")) {
            const animT = this.animation.getAnimationTime();
            const currentStep = Math.floor(animT * this.stepSize) / this.stepSize;
            if (currentStep > this.previousStep) {
                if(gamestate == "rolling dice") this.rollAllDice();
                else {
                    this.rollDice(this.diceToReroll);
                }
                this.previousStep = currentStep; // Update the previous mark
            }

            if(animT >= 1) {
                this.animation = null;
                this.previousStep = 0;
                if(gamestate == "rolling dice") {
                    gamestate = "rerolling dice";
                    tutorial.updateButton();
                }
                else {
                    this.diceRerolled++;
                    if(this.diceRerolled == this.availableRerolls) map.moveTruckInit();
                }
            }
        }


        let dicePos = this.getMousePosOfDice(dice);
        
        image(this.imgs[dice], dicePos.x, dicePos.y, this.height, this.height);
        const highlightSize = this.height/3;
        if(gamestate == "rerolling dice") image(rerollImg, dicePos.x + highlightSize/5, dicePos.y + highlightSize/5, highlightSize, highlightSize);

        if(gamestate == "route tracking") image(selectedImg, dicePos.x, dicePos.y, this.height, this.height)

        // Calculate the center position of the current image
        let centerX = dicePos.x + this.height / 2;
        let centerY = dicePos.y + this.height / 2;

        if(dice == 0) centerY += 6;

        noStroke();
        fill(0);
        textAlign(CENTER, CENTER); // Center the text horizontally and vertically
        textSize(this.height*2/7); // Adjust the font size as needed
        text(number, centerX, centerY);
    }

    getMousePosOfDice(dice) {
        const spacing = (this.width - 60 - this.height) / (this.imgs.length - 1);
        return {x: 30 + spacing*dice, y: this.pos.y};
    }

    
    rollingDiceInit() {
        gamestate = "rolling dice";
        tutorial.removeCurrentButton();
        routeTracker.drawBonusOverlay = false;
        this.animation = new ANIMATION(this.animationDuration,0,"easeOutCubic");
        this.diceRerolled = 0;
    }

    rollAllDice() {
        for(let i = 0; i < 6; i++) this.rollDice(i);
    }

    rollDice(dice) {
        if(dice == 0) this.numbers[dice] = Math.floor(Math.random() * 4) + 1;
        else if(dice == 1) this.numbers[dice] = Math.floor(Math.random() * 6) + 1;
        else if(dice == 2) this.numbers[dice] = Math.floor(Math.random() * 8) + 1;
        else if(dice == 3) this.numbers[dice] = Math.floor(Math.random() * 10) + 1;
        else if(dice == 4) this.numbers[dice] = Math.floor(Math.random() * 12) + 1;
        else if(dice == 5) this.numbers[dice] = Math.floor(Math.random() * 20) + 1;
    }

    handleInput(mouseX, mouseY) {
        let dice = this.collisionWithDice(mouseX, mouseY);
        if(dice != null) {
            this.animation = new ANIMATION(this.animationDuration,0,"easeOutCubic");
            this.diceToReroll = dice;
            tutorial.removeCurrentButton();
        }
    }

    collisionWithDice(mouseX, mouseY) {
        for(let i = 0; i < 6; i++) {
            let dicePos = this.getMousePosOfDice(i);
            if(dist(dicePos.x + this.height/2, dicePos.y + this.height/2, mouseX, mouseY) <= this.height/2) {
                return i;
            }
        }
        return null;
    }
}