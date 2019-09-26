"use strict"


class GameController {

    constructor(botsOnMap) {
        let height = 22;
        let width = 40;

        this.map = new LogicMap(height, width);
        Movable.map = this.map;

        this.player = new Player();

        this.aliveBots = [];
        this.deadBots = [];
        this.bulletsOnMap = [];

        botsOnMap = 10;
        this.textManager = new TextManager();
        this.statistics = new Statistics(botsOnMap);

        this.collisionManager = new CollisionManager(this.player, this.aliveBots);

        this.timeSpawn = 3000;

        this.render = new Render(this);

        gameMap.addEventListener("processedCollision", report => this.collisionCallBack(report));

        //document.body.addEventListener("click", () =>
        //    alert("mouse x: " + event.clientX + "\n" +
        //        "mouse y: " + event.clientY + "\n" +
        //        "object is: " + this.map.field[event.clientY][event.clientX].name));
    }

    run() {
        this.inputBindings();

        let renderBind = this.render.render.bind(this.render);
        let renderTimer = setInterval(renderBind, 20);

        let timeSpawnBind = this.defineTimeSpawn.bind(this);
        let timeSpawnTimer = setInterval(timeSpawnBind, 6000);

        this.spawnBind = this.newBot.bind(this, this.player);
        this.spawnTimer = setInterval(this.spawnBind, this.timeSpawn);
    }

    inputBindings() {
        let input = new Input(document.body);

        let playerMoveUp = this.player.moveUp.bind(this.player);
        input.watch("up", playerMoveUp, "w");

        let playerMoveRight = this.player.moveRight.bind(this.player);
        input.watch("right", playerMoveRight, "d");

        let playerMoveDown = this.player.moveDown.bind(this.player);
        input.watch("down", playerMoveDown, "s");

        let playerMoveLeft = this.player.moveLeft.bind(this.player);
        input.watch("left", playerMoveLeft, "a");

        let playerReload = this.player.startReload.bind(this.player);
        input.watch("reload", playerReload, "r");

        let playerMoveDiagonal = this.player.moveDiagonal.bind(this.player);
        input.watch("up left", playerMoveDiagonal, "w", "a");
        input.watch("up right", playerMoveDiagonal, "w", "d");
        input.watch("down left", playerMoveDiagonal, "s", "a");
        input.watch("down right", playerMoveDiagonal, "s", "d");

        let newBulletBind = this.newBullet.bind(this);
        gameMap.addEventListener("mousedown", newBulletBind);
    }

    defineTimeSpawn() {
        if (this.timeSpawn <= 1500)
            return;

        this.timeSpawn -= 200;

        clearInterval(this.spawnTimer);
        this.spawnTimer = setInterval(this.spawnBind, this.timeSpawn);
    }

    newBot(player) {
        if (this.aliveBots.length < 5 && !this.statistics.isGameEnd() &&
            !this.statistics.isLastBots(this.aliveBots.length)) {
            this.aliveBots.push(new Bot(player));
        }
    }

    newBullet() {
        if (this.player.shoot()) {
            let eraseBulletBind = this.eraseBullet.bind(this);
            this.bulletsOnMap.push(new Bullet(this.player.gunPoint, this.player.angle,
                this.aliveBots, eraseBulletBind));
        }
    }

    eraseBullet(bullet) {
        let actualBulletIndex = this.bulletsOnMap.indexOf(bullet);
        this.bulletsOnMap.splice(actualBulletIndex, 1);
    }

    collisionCallBack(e) {
        let report = e.detail.report;
        if (report.objectIsDead) {

            this.deadBots.push(report.object);
            report.object.dead();

            let curBotId = this.aliveBots.indexOf(report.object);
            this.aliveBots.splice(curBotId, 1);
            this.statistics.botsLeft--;
        }
    }
}