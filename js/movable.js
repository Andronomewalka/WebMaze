"use strict"


class Movable {

    static map;
    constructor() {
        this.pointBounds = [];
        this.speed = 1;
        this.maxSpeed = 8;
        this.angle = 0;
        this.viewTarget = new Point(0, 0);
        this.centerOffset = new Point(0, 0);
        this.centerPoint = new Point(0, 0);
        this.prevMoveTime = Date.now();
        this.direction = new Point(0, 0);
    }

    definePosition(fromPoint, offset) {
        let map = Movable.map.field;
        for (let i = fromPoint.y; i < map.length - 35; i += 34) {
            for (let k = fromPoint.x; k < map[0].length - 70; k += 34) {
                if (map[i][k].name == "space" &&
                    map[i][k + 35].name == "space" &&
                    map[i + 35][k + 35].name == "space" &&
                    map[i + 70][k + 35].name == "space" &&
                    map[i + 70][k].name == "space" &&
                    map[i + 35][k].name == "space") {
                    this.centerPoint.x = k + offset.x;
                    this.centerPoint.y = i + offset.y;
                    return;
                }
            }
        }
    }

    definePointBounds(x, y) {

        let res = [];

        let leftBound = -4;
        let rightBound = 4;
        for (let i = -7; i < 8; i++) {
            for (let k = leftBound; k <= rightBound; k++) {
                if (i == -7 || i == 7) {
                    res.push(new Point(x + k, y + i));
                } else
                    break;
            }

            if (i != -7 && i != 7) {
                res.push(new Point(x + leftBound, y + i));
                res.push(new Point(x + rightBound, y + i));
            }

            if (i <= -4) {
                leftBound--;
                rightBound++;
            } else if (i >= 4) {
                leftBound++;
                rightBound--;
            }
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

    updateAngleInternalState() {
        this.angle = this.defineAngle(this.centerPoint.x, this.centerPoint.y);
    }

    updatePointBoundsInternalState() {
        this.pointBounds = this.definePointBounds(this.centerPoint.x, this.centerPoint.y, this.angle);
    }
}