class Player extends Movable {
    constructor() {

        super();

        this.centerOffset = new Point(18, 59);
        this.size = new Point(scale, scale * 2);
        this.upLeftTilesetPosition = new Point(0, 0);


        this.palyerMoved = new CustomEvent("playerMoved");

        this.gunPoint = new Point(0, 0);

        this.definePosition(new Point(Movable.map.field[0].length / 2 - 50, Movable.map.field.length / 2 - 50));
        this.updatePointBoundsInternalState();

        document.body.addEventListener("mousemove", (e) => {
            this.viewTarget.x = e.clientX;
            this.viewTarget.y = e.clientY;
            let newAngle = super.defineAngle(this.centerPoint.x, this.centerPoint.y);
            // if (this.isFreeSpace(this.centerPoint.x, this.centerPoint.y, newAngle)) {
            this.updateAngleInternalState();
            this.updatePointBoundsInternalState();
            this.updateGunPoint();
            // }
        });


    }

    definePointBounds(x, y, angle) {

        let res = [];

        //let rotationKoefX = this.defineRotationKoefX(angle);
        //let rotationKoefY = this.defineRotationKoefY(angle);

        let leftBound = -4;
        let rightBound = 4;
        for (let i = -7; i < 8; i++) {
            for (let k = leftBound; k <= rightBound; k++) {
                if (i == -7 || i == 7) {
                    // res.push(this.defineRotationPoint(x, k, y, i, rotationKoefX, rotationKoefY));
                    res.push(new Point(x + k, y + i));
                } else
                    break;
            }

            if (i != -7 && i != 7) {
                res.push(new Point(x + leftBound, y + i));
                res.push(new Point(x + rightBound, y + i));
                // res.push(this.defineRotationPoint(x, leftBound, y, i, rotationKoefX, rotationKoefY));
                // res.push(this.defineRotationPoint(x, rightBound, y, i, rotationKoefX, rotationKoefY));
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

    moveUp() {
        this.defineMoveSpeed();
        for (let i = 0; i < this.speed; i++) {

            // let newAngle = this.defineAngle(this.centerPoint.x, this.centerPoint.y - this.speed + i, this.centerPoint.y);

            if (this.isFreeSpace(this.centerPoint.x, this.centerPoint.y - this.speed + i - 7, this.angle)) {


                //  console.log("up " + this.speed);
                this.defineDirection(0, -1);
                this.move();
                this.nextTileAnimation();

                //  if (this.isFreeSpace(this.centerPoint.x, this.centerPoint.y - this.speed + i, newAngle))
                this.updateAngleInternalState();


                this.updateGunPoint();
                gameMap.dispatchEvent(this.palyerMoved);
                return;

            }
        }
    }

    moveRight() {
        this.defineMoveSpeed();
        for (let i = 0; i < this.speed; i++) {

            //let newAngle = this.defineAngle(this.centerPoint.x + this.speed - i, this.centerPoint.y);

            if (this.isFreeSpace(this.centerPoint.x + this.speed - i + 7, this.centerPoint.y, this.angle)) {

                //console.log("right " + this.speed);
                this.defineDirection(1, 0);
                this.move();
                this.nextTileAnimation();

                //  if (this.isFreeSpace(this.centerPoint.x + this.speed - i, this.centerPoint.y, newAngle))
                this.updateAngleInternalState();

                this.updateGunPoint();
                gameMap.dispatchEvent(this.palyerMoved);
                return;
            }
        }
    }

    moveDown() {
        this.defineMoveSpeed();
        for (let i = 0; i < this.speed; i++) {

            // let newAngle = this.defineAngle(this.centerPoint.x, this.centerPoint.y + this.speed - i, this.centerPoint.y);

            if (this.isFreeSpace(this.centerPoint.x, this.centerPoint.y + this.speed - i + 7, this.angle)) {

                //console.log("down " + this.speed);
                this.defineDirection(0, 1);
                this.move();
                this.nextTileAnimation();

                // if (this.isFreeSpace(this.centerPoint.x, this.centerPoint.y + this.speed - i, newAngle))
                this.updateAngleInternalState();

                this.updateGunPoint();
                gameMap.dispatchEvent(this.palyerMoved);
                return;
            }
        }
    }

    moveLeft() {
        this.defineMoveSpeed();
        for (let i = 0; i < this.speed; i++) {

            // let newAngle = this.defineAngle(this.centerPoint.x - this.speed + i, this.centerPoint.y, this.centerPoint.y);

            if (this.isFreeSpace(this.centerPoint.x - this.speed + i - 7, this.centerPoint.y, this.angle)) {

                // console.log("left " + this.speed);
                this.defineDirection(-1, 0);
                this.move();
                this.nextTileAnimation();

                // if (this.isFreeSpace(this.centerPoint.x - this.speed + i, this.centerPoint.y, newAngle)) 
                this.updateAngleInternalState();

                this.updateGunPoint();
                gameMap.dispatchEvent(this.palyerMoved);
                return;

            }
        }
    }

    moveDiagonal() {
        this.speed /= 1.4;
    }

    updateGunPoint() {

        let rotationKoefX = this.defineRotationKoefX(this.angle);
        let rotationKoefY = this.defineRotationKoefY(this.angle);

        this.gunPoint = this.defineRotationPoint(this.centerPoint.x, 0,
            this.centerPoint.y, -59, rotationKoefX, rotationKoefY);
    }

    isFreeSpace(newX, newY, newAngle) {

        let tempPointBounds = this.definePointBounds(newX, newY, newAngle);

        for (let i = 0; i < tempPointBounds.length; i++) {
            if (Movable.map.field[tempPointBounds[i].y][tempPointBounds[i].x].name != "space" &&
                Movable.map.field[tempPointBounds[i].y][tempPointBounds[i].x].name != "bot") {
                return false;
            }
        }
        return true;
    }
}