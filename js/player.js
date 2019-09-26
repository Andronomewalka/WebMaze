class Player extends Movable {
    constructor() {

        super();

        this.clip = 10;
        this.bulletsInClip = this.clip;
        this.maxHp = 100;
        this.curHp = this.maxHp;
        this.minDamage = 3;
        this.maxDamage = 5;

        this.palyerMoved = new CustomEvent("playerMoved");

        this.gunPoint = new Point(0, 0);

        // let centerOffset = new Point(18, 59);
        let centerOffset = new Point(18, 59);
        let centerBodyOffset = new Point(18, 27);
        let centerHandsOffset = new Point(16, 62);


        this.definePosition(new Point(Movable.map.field[0].length / 2 - 50, Movable.map.field.length / 2 - 50), centerOffset);

        let centerPointHands = new Point(this.centerPoint.x, this.centerPoint.y + 15);

        this.visualBody = new Visual(this.centerPoint, centerBodyOffset, new Point(scale, scale), 0, [0, 35, 70, 105, 140]);
        this.visualHands = new Visual(this.centerPoint, centerHandsOffset, new Point(scale, scale), 0, [35, 70, 105, 0]);
        this.hpBar = new ProgressBar(this.maxHp, 70, 11, this.centerPoint.x - 20, this.centerPoint.y - 45);
        this.clipBar = new ProgressBar(this.clip, 70, 11, this.centerPoint.x - 20, this.centerPoint.y - 60);

        this.updatePointBoundsInternalState();

        this.inReloadAnimation = false;
        this.reloadAnimation;

        document.body.addEventListener("mousemove", (e) => {
            this.viewTarget.x = e.clientX;
            this.viewTarget.y = e.clientY;
            let newAngle = super.defineAngle(this.centerPoint.x, this.centerPoint.y);
            this.updateAngleInternalState();
            this.updatePointBoundsInternalState();
            this.updateGunPoint();
            this.visualBody.updateAngel(newAngle);
            this.visualHands.updateAngel(newAngle);
        });


    }

    moveUp() {
        this.defineMoveSpeed();
        for (let i = 0; i < this.speed; i++) {

            if (this.isFreeSpace(this.centerPoint.x, this.centerPoint.y - this.speed + i - 7, this.angle)) {

                this.defineDirection(0, -1);
                this.move();
                this.moveMade();
                return;

            }
        }
    }

    moveRight() {
        this.defineMoveSpeed();
        for (let i = 0; i < this.speed; i++) {

            if (this.isFreeSpace(this.centerPoint.x + this.speed - i + 7, this.centerPoint.y, this.angle)) {

                this.defineDirection(1, 0);
                this.move();
                this.moveMade();
                return;
            }
        }
    }

    moveDown() {
        this.defineMoveSpeed();
        for (let i = 0; i < this.speed; i++) {

            if (this.isFreeSpace(this.centerPoint.x, this.centerPoint.y + this.speed - i + 7, this.angle)) {

                this.defineDirection(0, 1);
                this.move();
                this.moveMade();
                return;
            }
        }
    }

    moveLeft() {
        this.defineMoveSpeed();
        for (let i = 0; i < this.speed; i++) {
            if (this.isFreeSpace(this.centerPoint.x - this.speed + i - 7, this.centerPoint.y, this.angle)) {

                this.defineDirection(-1, 0);
                this.move();
                this.moveMade();
                return;
            }
        }
    }

    moveDiagonal() {
        this.speed /= 1.4;
        this.visualBody.animation.animationDelay = 6;
    }

    moveMade() {
        this.updateAngleInternalState();
        this.updateGunPoint();
        this.updateBarsPosition();

        this.visualBody.animation.nextMoveTileAnimation(this.direction.x, this.direction.y, this.angle);
        this.visualBody.animation.animationDelay = 3;
        this.visualBody.updateCenterPoint(this.centerPoint);
        this.visualBody.updateAngel(this.angle);

        this.visualHands.updateCenterPoint(this.centerPoint);
        this.visualHands.updateAngel(this.angle);

        gameMap.dispatchEvent(this.palyerMoved);
    }

    updateGunPoint() {

        let rotationKoefX = this.defineRotationKoefX(this.angle);
        let rotationKoefY = this.defineRotationKoefY(this.angle);

        this.gunPoint = this.defineRotationPoint(this.centerPoint.x, 0,
            this.centerPoint.y, -45, rotationKoefX, rotationKoefY);
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

    shoot() {

        if (this.inReloadAnimation)
            return;

        this.bulletsInClip--;
        this.clipBar.updateCurLineLength(this.bulletsInClip);

        if (this.bulletsInClip == 0) {
            this.startReload();
        }

        return true;

    }

    startReload() {

        if (this.inReloadAnimation || this.bulletsInClip == this.clip)
            return;

        this.bulletsInClip = 0;
        this.inReloadAnimation = true;
        let reloadAnimationBind = this.nextReloadAnimation.bind(this);
        this.reloadAnimation = setInterval(reloadAnimationBind, 60);

        let endReloadBind = this.endReload.bind(this);
        this.visualHands.animation.runAnimationInterval(endReloadBind, 200);
    }

    endReload() {
        this.bulletsInClip = this.clip;
        this.clipBar.updateCurLineLength(this.bulletsInClip);
    }

    nextReloadAnimation() {
        if (parseInt(this.clipBar.curWidth, 10) == this.clipBar.maxWidth) {
            clearInterval(this.reloadAnimation);
            //this.endReload();
            this.inReloadAnimation = false;
        } else {
            this.bulletsInClip++;
            this.clipBar.updateCurLineLength(this.bulletsInClip);
        }
    }

    updateBarsPosition() {
        this.hpBar.updatePosition(this.centerPoint.x - 20, this.centerPoint.y - 45);
        this.clipBar.updatePosition(this.centerPoint.x - 20, this.centerPoint.y - 60);
    }
}