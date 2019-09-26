"use strict"

class Bot extends Movable {

    static directions = [new Point(0, -1), new Point(1, -1), new Point(1, 0), new Point(1, 1),
        new Point(0, 1), new Point(-1, 1), new Point(-1, 0), new Point(-1, -1)
    ];

    constructor(player) {

        super();
        this.player = player;
        this.maxSpeed = 8;
        this.hitAreaBounds = [];
        this.maxHp = 10;
        this.curHp = this.maxHp;
        this.botMoved = new CustomEvent("botMoved");
        this.hpBar = new ProgressBar(this.maxHp, 35, 7, this.centerPoint.x - 20, this.centerPoint.y - 30);
        this.isDead = false;

        this.definePosition();

        let centerOffset = new Point(18, 60);
        this.visual = new Visual(this.centerPoint, centerOffset, new Point(scale, scale * 2), 0, [0, 35, 70, 105, 140]);

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
        this.visual.updateAngel(this.angle);
    }

    defineDirection() {
        this.direction.y = -Math.cos(this.angle);
        this.direction.x = Math.sin(this.angle);
    }

    move() {
        if (this.isFreeSpace(this.centerPoint.x + this.direction.x * this.speed, this.centerPoint.y + this.direction.y * this.speed, this.angle)) {
            this.defineMoveSpeed();
            super.move();
            this.defineHitAreaBounds();
            this.hpBar.updatePosition(this.centerPoint.x - 20, this.centerPoint.y - 30);

            this.visual.animation.nextMoveTileAnimation(this.direction.x, this.direction.y, this.angle);
            this.visual.updateCenterPoint(this.centerPoint);
            this.visual.updateAngel(this.angle);
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
        this.visual.upLeftTilesetPosition.x = 175;
    }
}