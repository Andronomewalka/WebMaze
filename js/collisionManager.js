"use strict"


class CollisionManager {
    constructor(player, aliveBots) {
        this.player = player;
        this.aliveBots = aliveBots;;

        this.collisionReport = new CollisionReport();
        this.processedCollision = new CustomEvent("processedCollision", {
            detail: {
                report: this.collisionReport
            }
        });

        gameMap.addEventListener("rawCollision", e => this.collisionBulletBot(e.detail.botIndex.value));
    }

    collisionBulletBot(botIndex) {

        this.collisionReport.objectIsDead = false;

        let curDamage = random(this.player.minDamage, this.player.maxDamage + 1);
        let crit = this.isCrit();
        let damage = crit ? curDamage * 3 : curDamage;

        this.collisionReport.isCrit = crit;
        this.collisionReport.damage = damage;

        let newHp = this.aliveBots[botIndex].curHp - damage;
        let curBot = this.aliveBots[botIndex];

        this.collisionReport.objectPosition.x = curBot.centerPoint.x;
        this.collisionReport.objectPosition.y = curBot.centerPoint.y;
        this.collisionReport.object = curBot;


        if (newHp <= 0) {
            this.collisionReport.objectIsDead = true;
        } else {
            curBot.curHp = newHp;
            curBot.hpBar.updateCurLineLength(newHp);
            curBot.speed = 0;
        }

        gameMap.dispatchEvent(this.processedCollision);
    }

    isCrit() {
        let chance = 10;
        let randChance = random(0, chance + 1);
        return (chance == randChance);
    }
}

class CollisionReport {
    constructor() {
        this.object;
        this.objectIsDead = false;
        this.damage = 0;
        this.isCrit = false;
        this.objectPosition = new Point(0, 0);
    }
}