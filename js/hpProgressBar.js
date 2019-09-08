"use strict"

class HpProgressBar {
    constructor(maxValue, xpos, ypos) {
        this.maxValue = maxValue;
        this.curWidth = 35;
        this.maxWidth = 35;
        this.height = 7;
        this.position = new Point(xpos, ypos);
    }

    updateCurLineLength(newValue) {
        this.curWidth = newValue * this.curWidth / this.maxValue;
    }

    updatePosition(x, y) {
        this.position = new Point(0, 0);
        this.position.x = x;
        this.position.y = y;
    }
}