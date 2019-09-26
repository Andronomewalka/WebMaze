"use strict"

class Visual {
    constructor(centerPoint, centerOffset, size, angle, tilesetXArray) {
        this.upLeftTilesetPosition = new Point(0, 0);
        this.centerOffset = centerOffset;
        this.centerPoint = centerPoint;
        this.size = size;
        this.angle = angle;
        this.animation = new TileAnimation(this.upLeftTilesetPosition, tilesetXArray);
    }

    updateCenterPoint(newPoint) {
        this.centerPoint = newPoint;
    }

    updateAngel(newAngle) {
        this.angle = newAngle;
    }
}