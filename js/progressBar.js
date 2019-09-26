"use strict"

class ProgressBar {
    constructor(maxValue, maxWidth, height, xpos, ypos) {
        this.maxValue = maxValue;
        this.curWidth = maxWidth;
        this.maxWidth = maxWidth;
        this.height = height;
        this.position = new Point(xpos, ypos);
    }

    updateCurLineLength(newValue) {
        this.curWidth = newValue * this.maxWidth / this.maxValue;
    }

    updatePosition(x, y) {
        this.position = new Point(0, 0);
        this.position.x = x;
        this.position.y = y;
    }
}