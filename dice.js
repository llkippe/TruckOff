class DICE {
    constructor(img4,img6,img8,img10,img12,img20) {
        this.width = width;
        this.height = 200;
        this.pos = {
            x: 0,
            y: map.getRawYPos() - this.height
        }

        this.imgs = [];
        this.imgs.push(img4,img6,img8,img10,img12,img20);

        this.numbers = [];
        this.numbers.push(4,6,8,10,12,20);
    }

    draw() {
        fill(255);
        rect(this.pos.x, this.pos.y, this.width, this.height);

        for (let i = 0; i < this.imgs.length; i++) {
            this.drawDice(i, this.numbers[i]);
        }
    }

    drawDice(dice, number) {
        let spacing = (this.width - 60 - this.height) / (this.imgs.length - 1); // Adjusted step size
        let x = 30 + spacing*dice;

        image(this.imgs[dice], x, this.pos.y, this.height, this.height);
        // Calculate the center position of the current image
        let centerX = x + this.height / 2;
        let centerY = this.pos.y + this.height / 2;

        noStroke();
        textAlign(CENTER, CENTER); // Center the text horizontally and vertically
        textSize(44); // Adjust the font size as needed
        text(number, centerX, centerY);
    }
}