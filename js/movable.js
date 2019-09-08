"use strict"


class Movable {

    static map;
    constructor() {
        this.pointBounds = [];
        this.size = new Point(scale, scale);
        this.upLeftTilesetPoistion = new Point(0, 0);
        this.speed = 1;
        this.maxSpeed = 8;
        this.angle = 0;
        this.viewTarget = new Point(0, 0);
        this.centerOffset = new Point(0, 0);
        this.centerPoint = new Point(0, 0);
        this.prevMoveTime = Date.now();
        this.direction = new Point(0, 0);
        this.animationDelay = 3;
        this.animationCurDelay = 3;
    }

    definePosition(fromPoint) {
        let map = Movable.map.field;
        for (let i = fromPoint.y; i < map.length - 35; i += 34) {
            for (let k = fromPoint.x; k < map[0].length - 70; k += 34) {
                if (map[i][k].name == "space" &&
                    map[i][k + 35].name == "space" &&
                    map[i + 35][k + 35].name == "space" &&
                    map[i + 70][k + 35].name == "space" &&
                    map[i + 70][k].name == "space" &&
                    map[i + 35][k].name == "space") {
                    this.centerPoint.x = k + this.centerOffset.x;
                    this.centerPoint.y = i + this.centerOffset.y;
                    return;
                }
            }
        }
    }

    definePointBounds(x, y, angle) {

        let res = [];

        let rotationKoefX = this.defineRotationKoefX(angle);
        let rotationKoefY = this.defineRotationKoefY(angle);

        let leftBound = -2;
        let rightBound = 3;
        for (let i = -24; i < 2; i++) {
            for (let k = leftBound; k <= rightBound; k++) {
                if (i == -24 || i == 1) {
                    res.push(this.defineRotationPoint(x, k, y, i, rotationKoefX, rotationKoefY));
                } else
                    break;
            }
            if (i < -15) {
                leftBound--;
                rightBound++;
            } else if (i > -9) {
                leftBound++;
                rightBound--;
            }
            res.push(this.defineRotationPoint(x, leftBound, y, i, rotationKoefX, rotationKoefY));
            res.push(this.defineRotationPoint(x, rightBound, y, i, rotationKoefX, rotationKoefY));
        }

        return res;
    }

    isFreeSpace(newX, newY, newAngle) {

        let tempPointBounds = this.definePointBounds(newX, newY, newAngle);

        for (let i = 0; i < tempPointBounds.length; i++) {
            if (Movable.map.field[tempPointBounds[i].y][tempPointBounds[i].x].name != "space") {
                return false;
            }
        }
        return true;
    }

    defineRotationKoefX(angle) {
        return new PointF(Math.cos(angle), Math.sin(angle));
    }

    defineRotationKoefY(angle) {
        return new PointF(-Math.sin(angle), Math.cos(angle));
    }

    defineRotationPoint(x, xOffset, y, yOffset, rotationKoefX, rotationKoefY) {

        let arg1 = new PointF(xOffset * rotationKoefX.x, xOffset * rotationKoefX.y);
        let arg2 = new PointF(yOffset * rotationKoefY.x, yOffset * rotationKoefY.y);

        return new Point(x + arg1.x + arg2.x, y + arg1.y + arg2.y);
    }

    defineAngle(ax, ay) {
        let bx = this.viewTarget.x;
        let by = this.viewTarget.y;

        let dbx = bx - ax;
        let dby = by - ay;

        let res = Math.acos((dby * (-1)) / Math.sqrt(Math.pow(dbx, 2) + Math.pow(dby, 2)));

        if (bx < ax) {
            res = 6.283 - res;
        }

        return res;
    }

    defineDirection(x, y) {
        this.direction.x = x;
        this.direction.y = y;
    }

    defineMoveSpeed() {
        let curMoveTime = Date.now();
        if (curMoveTime - this.prevMoveTime < 60) {
            if (this.speed < this.maxSpeed) {
                this.speed++;
            }
        } else {
            this.speed = 1;
        }
        this.prevMoveTime = curMoveTime;
    }

    move(speed) {
        if (speed == undefined)
            speed = this.speed;
        this.centerPoint.x += this.direction.x * this.speed;
        this.centerPoint.y += this.direction.y * this.speed;
        this.updatePointBoundsInternalState();
    }

    nextTileAnimation() {
        if (this.animationCurDelay == 0) {
            if (this.upLeftTilesetPosition.x == 0)
                this.upLeftTilesetPosition.x = 35;
            else if (this.upLeftTilesetPosition.x == 35)
                this.upLeftTilesetPosition.x = 70;
            else if (this.upLeftTilesetPosition.x == 70)
                this.upLeftTilesetPosition.x = 105;
            else if (this.upLeftTilesetPosition.x == 105)
                this.upLeftTilesetPosition.x = 140;
            else if (this.upLeftTilesetPosition.x == 140)
                this.upLeftTilesetPosition.x = 0;

            this.animationCurDelay = this.animationDelay;
        }
        this.animationCurDelay--;
    }

    updateAngleInternalState() {
        this.angle = this.defineAngle(this.centerPoint.x, this.centerPoint.y);
    }

    updatePointBoundsInternalState() {
        this.pointBounds = this.definePointBounds(this.centerPoint.x, this.centerPoint.y, this.angle);
    }
}