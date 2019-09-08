"use strict"


class GameController {

    static aliveBots = [];
    static deadBots = [];
    static bulletsOnMap = [];

    constructor() {
        let height = 22;
        let width = 40;

        this.map = new LogicMap(height, width);
        Movable.map = this.map;

        this.player = new Player();

        this.timeSpawn = 3000;

        this.render = new Render(this);

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

        //this.newBot(this.player);
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

        let playerMoveDiagonal = this.player.moveDiagonal.bind(this.player);
        input.watch("up left", playerMoveDiagonal, "w", "a");
        input.watch("up right", playerMoveDiagonal, "w", "d");
        input.watch("down left", playerMoveDiagonal, "s", "a");
        input.watch("down right", playerMoveDiagonal, "s", "d");

        let newBulletBind = this.newBullet.bind(this);
        gameMap.addEventListener("click", newBulletBind);
    }

    defineTimeSpawn() {
        if (this.timeSpawn <= 1500)
            return;

        this.timeSpawn -= 200;

        clearInterval(this.spawnTimer);
        this.spawnTimer = setInterval(this.spawnBind, this.timeSpawn);
    }

    newBot(player) {
        if (GameController.aliveBots.length < 5)
            GameController.aliveBots.push(new Bot(player));
    }

    newBullet() {
        let bulletPosition = new Point(this.player.gunPoint.x, this.player.gunPoint.y);
        GameController.bulletsOnMap.push(new Bullet(bulletPosition, this.player.angle, GameController.bulletsOnMap.length));
    }
}