"sue strict"


class Bullet extends Movable {

    constructor(position, angle, aliveBots, eraseBulletCallback) {

        super();

        this.angle = angle;
        this.speed = 15;
        this.direction = new Point(0, 0);
        this.isCollission = false;
        this.eraseBulletCallback = eraseBulletCallback;
        this.aliveBots = aliveBots;

        this.definePosition(position);
        this.defineDirection(angle);

        let centerOffset = new Point(16, 29);
        this.visualBullet = new Visual(this.centerPoint, centerOffset, new Point(scale, scale), this.angle, [0, 35, 70, 105, 140]);
        this.visualExpl = new Visual(position, centerOffset, new Point(scale, scale), this.angle, [35, 35]);

        this.inExplosiveAnimation = false;
        this.startExplAnimation();

        let moveBind = this.move.bind(this);
        this.moveTimer = setInterval(moveBind, 20);

        this.botCollisionIndex = { value: -1 };
        this.rawCollision = new CustomEvent("rawCollision", {
            detail: {
                botIndex: this.botCollisionIndex
            }
        });
    }

    definePosition(position) {
        this.centerPoint.x = position.x;
        this.centerPoint.y = position.y;
    }

    defineDirection(angle) {
        this.direction.y = -Math.cos(angle);
        this.direction.x = Math.sin(angle);
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

    startExplAnimation() {
        this.inExplosiveAnimation = true;
        this.visualExpl.animation.runAnimationInterval(() => this.inExplosiveAnimation = false, 50);
    }

    startAnimationHit() {

        let eraseBulletBind = this.eraseBulletCallback.bind(this);
        this.visualBullet.animation.runAnimationInterval(eraseBulletBind, 20, this);
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
        let botCollisionIndex = this.aliveBots.findIndex(bot => {
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
            this.botCollisionIndex.value = botCollisionIndex;
            gameMap.dispatchEvent(this.rawCollision);
            return true;
        }

        return false;
    }
}