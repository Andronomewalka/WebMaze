"sue strict"


class Bullet extends Movable {

    constructor(position, angle, index) {

        super();

        this.angle = angle;
        this.upLeftTilesetPosition = new Point(0, 0);
        this.centerOffset = new Point(16, 29);
        this.speed = 15;
        this.direction = new Point(0, 0);
        this.isCollission = false;
        this.bulletInitIndex = index;

        definePosition.call(this);
        defineDirection.call(this);

        let moveBind = this.move.bind(this);
        this.moveTimer = setInterval(moveBind, 20);

        function definePosition() {
            this.centerPoint.x = position.x;
            this.centerPoint.y = position.y;
        }

        function defineDirection() {
            this.direction.y = -Math.cos(angle);
            this.direction.x = Math.sin(angle);
        }
    }

    definePointBounds(x, y, angle) {

        let res = [];

        let rotationKoefX = this.defineRotationKoefX(angle);
        let rotationKoefY = this.defineRotationKoefY(angle);


        for (let i = -6; i < 6; i++) {
            for (let k = -1; k < 2; k++) {
                res.push(this.defineRotationPoint(x, k, y, i, rotationKoefX, rotationKoefY));
            }
        }

        return res;
    }

    move() {

        if (!this.isBotCollision()) {
            for (let i = this.speed; i > 0; i--) {
                if (this.isFreeSpace(this.centerPoint.x + this.direction.x * i, this.centerPoint.y + this.direction.y * i, this.angle)) {
                    super.move(i);
                    return;
                }
            }
        }
        this.stopMove();
    }

    stopMove() {
        clearInterval(this.moveTimer);
        this.startAnimationHit();
    }

    startAnimationHit() {
        let animationBind = this.hitAnimation.bind(this);
        this.animationTimer = setInterval(animationBind, 20);
    }

    hitAnimation() {
        if (this.upLeftTilesetPosition.x == 0)
            this.upLeftTilesetPosition.x = 35;
        else if (this.upLeftTilesetPosition.x == 35)
            this.upLeftTilesetPosition.x = 70;
        else if (this.upLeftTilesetPosition.x == 70)
            this.upLeftTilesetPosition.x = 105;
        else if (this.upLeftTilesetPosition.x == 105)
            this.upLeftTilesetPosition.x = 140;
        else {
            clearInterval(this.animationTimer);
            let actualBulletIndex = this.bulletInitIndex;
            if (this.bulletInitIndex != GameController.bulletsOnMap)
                actualBulletIndex = this.bulletInitIndex - GameController.bulletsOnMap
            GameController.bulletsOnMap.splice(actualBulletIndex, 1);
        }
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
    isBotCollision() {
        let botCollisionIndex = GameController.aliveBots.findIndex(bot => {
            let xs = bot.hitAreaBounds.map(item => item.x);
            let ys = bot.hitAreaBounds.map(item => item.y);
            let minX = Math.min.apply(null, xs);
            let minY = Math.min.apply(null, ys);
            let maxX = Math.max.apply(null, xs);
            let maxY = Math.max.apply(null, ys);
            if (this.centerPoint.x >= minX && this.centerPoint.x <= maxX &&
                this.centerPoint.y >= minY && this.centerPoint.y <= maxY) {
                return true;
            }
        });
        if (botCollisionIndex != -1) {
            let newHp = GameController.aliveBots[botCollisionIndex].curHp - 4;
            if (newHp <= 0) {
                let newDeadBot = GameController.aliveBots[botCollisionIndex];
                GameController.deadBots.push(newDeadBot);
                newDeadBot.dead();
                GameController.aliveBots.splice(botCollisionIndex, 1);
            } else {
                GameController.aliveBots[botCollisionIndex].curHp = newHp;
                GameController.aliveBots[botCollisionIndex].hpBar.updateCurLineLength(newHp);
                GameController.aliveBots[botCollisionIndex].speed = 0;
            }
            return true;
        }

        return false;
    }
}