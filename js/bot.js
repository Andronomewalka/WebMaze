"use strict"

class Bot extends Movable {

    static directions = [new Point(0, -1), new Point(1, -1), new Point(1, 0), new Point(1, 1),
        new Point(0, 1), new Point(-1, 1), new Point(-1, 0), new Point(-1, -1)
    ];

    constructor(player) {

        super();
        this.player = player;
        this.centerOffset = new Point(18, 60);
        this.size = new Point(scale, scale * 2);
        this.upLeftTilesetPosition = new Point(0, 0);
        this.toPlayerRoute = [];
        this.moveMap = [];
        this.playerIsFound = false;
        this.maxSpeed = 8;
        this.animationDelay = 2;
        this.hitAreaBounds = [];
        this.maxHp = 10;
        this.curHp = this.maxHp;
        this.botMoved = new CustomEvent("botMoved");
        this.hpBar = new HpProgressBar(this.maxHp, this.centerPoint.x - 20, this.centerPoint.y - 30);
        this.isDead = false;
        this.definePosition();
        this.updateViewTarget();
        this.updatePointBoundsInternalState();
        this.defineHitAreaBounds();

        this.watchPLayerBind = this.watchPlayerFunc.bind(this);

        let moveBind = this.move.bind(this);
        this.moveTimer = setInterval(moveBind, 50);
    }

    watchPlayerFunc() {
        this.updateViewTarget();
        this.defineDirection();
    }

    startWatchPlayer() {
        if (!this.isDead) {
            this.watchPlayerFunc()
            gameMap.addEventListener("playerMoved", this.watchPLayerBind);
        }
    }

    stopWatchPlayer() {
        gameMap.removeEventListener("playerMoved", this.watchPLayerBind);
    }

    stopMove() {
        clearInterval(this.moveTimer);
    }

    dead() {
        this.isDead = true;
        this.stopWatchPlayer();
        this.stopMove();
        this.deadAnimation();
    }

    definePosition() {
        let gate = random(0, 4);

        switch (gate) {
            case 0:
                this.centerPoint.x = Movable.map.gates.top.x + 35;
                this.centerPoint.y = Movable.map.gates.top.y + 17;
                this.direction = new Point(0, 1);
                break;
            case 1:
                this.centerPoint.x = Movable.map.gates.right.x - 17;
                this.centerPoint.y = Movable.map.gates.right.y + 35;
                this.direction = new Point(-1, 0);
                break;
            case 2:
                this.centerPoint.x = Movable.map.gates.bottom.x + 35;
                this.centerPoint.y = Movable.map.gates.bottom.y - 17;
                this.direction = new Point(0, -1);
                break;
            case 3:
                this.centerPoint.x = Movable.map.gates.left.x + 17;
                this.centerPoint.y = Movable.map.gates.left.y + 35;
                this.direction = new Point(1, 0);
                break;
        }


        let startWatchPlayerBind = this.startWatchPlayer.bind(this);
        setTimeout(startWatchPlayerBind, 500);
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

    defineHitAreaBounds() {

        this.hitAreaBounds = [];

        let rotationKoefX = this.defineRotationKoefX(this.angle);
        let rotationKoefY = this.defineRotationKoefY(this.angle);

        this.hitAreaBounds.push(this.defineRotationPoint(this.centerPoint.x, -11, this.centerPoint.y, -24, rotationKoefX, rotationKoefY));
        this.hitAreaBounds.push(this.defineRotationPoint(this.centerPoint.x, -11, this.centerPoint.y, 5, rotationKoefX, rotationKoefY));
        this.hitAreaBounds.push(this.defineRotationPoint(this.centerPoint.x, 11, this.centerPoint.y, -24, rotationKoefX, rotationKoefY));
        this.hitAreaBounds.push(this.defineRotationPoint(this.centerPoint.x, 11, this.centerPoint.y, 5, rotationKoefX, rotationKoefY));
    }

    updateViewTarget() {
        this.viewTarget.x = this.player.centerPoint.x;
        this.viewTarget.y = this.player.centerPoint.y;
        this.updateAngleInternalState();
        this.defineHitAreaBounds();
    }

    defineDirection() {
        this.direction.y = -Math.cos(this.angle);
        this.direction.x = Math.sin(this.angle);
    }

    move() {
        if (this.isFreeSpace(this.centerPoint.x + this.direction.x * this.speed, this.centerPoint.y + this.direction.y * this.speed, this.angle)) {
            this.defineMoveSpeed();
            super.move();
            this.nextTileAnimation();
            this.defineHitAreaBounds();
            this.hpBar.updatePosition(this.centerPoint.x - 20, this.centerPoint.y - 30);
        }
    }

    isFreeSpace(newX, newY, newAngle) {

        let tempPointBounds = this.definePointBounds(newX, newY, newAngle);

        for (let i = 0; i < tempPointBounds.length; i++) {
            if (Movable.map.field[tempPointBounds[i].y][tempPointBounds[i].x].name != "space" &&
                Movable.map.field[tempPointBounds[i].y][tempPointBounds[i].x].name != "gate") {
                return false;
            }
        }
        return true;
    }

    deadAnimation() {
        this.upLeftTilesetPosition.x = 175;
    }
}