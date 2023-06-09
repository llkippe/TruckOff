class BUTTON {
    constructor(x,y,w,h,r,paddingY,strokeWidth,strokeColor,fillColor,textColor,text,clickedFkt) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.r = r;
        this.paddingY = paddingY
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;
        this.strokeWidth = strokeWidth;
        this.textColor = textColor;
        this.text = text;
        this.clickedFkt = clickedFkt;
        this.opacity = 1;
    }
    handleInput(mouseX,mouseY) {
        if(collisionRectRect(this.x,this.y,this.w,this.h,mouseX-5,mouseY-5,10,10)) {
            this.clickedFkt();
        }
    }
    draw() {
        rectMode(CORNER);
        fill(red(this.fillColor),green(this.fillColor),blue(this.fillColor),alpha(this.fillColor) * this.opacity);
        stroke(red(this.strokeColor),green(this.strokeColor),blue(this.strokeColor),alpha(this.strokeColor) * this.opacity);
        strokeWeight(this.strokeWidth);
        rect(this.x,this.y,this.w,this.h,this.r);

        noStroke();
        textAlign(CENTER,CENTER);
        textSize(this.h - this.paddingY);
        fill(red(this.textColor),green(this.textColor),blue(this.textColor),alpha(this.textColor) * this.opacity);
        text(this.text, this.x + this.w/2, this.y + this.h/2);
    }

    setOpacity(opacity) {
        this.opacity = opacity;
    }
    setFillColor(fillColor) {
        this.fillColor = fillColor;
    }
    setTextColor(textColor) {
        this.textColor = textColor;
    }
    setStrokeColor(strokeColor) {
        this.strokeColor = strokeColor;
    }
}