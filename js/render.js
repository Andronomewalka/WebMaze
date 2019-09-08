"use strict"


class Render {
    constructor(controller) {
        gameMap.width = screen.availWidth;
        gameMap.height = screen.availHeight;
        this.gameMapContext = gameMap.getContext("2d");

        this.fieldTileset = new Image();
        this.fieldTileset.src = "img/fieldTileset.png";

        this.playerTileset = new Image();
        this.playerTileset.src = "img/playerTileset.png";

        this.botTileset = new Image();
        this.botTileset.src = "img/botTileset.png";

        this.fireTileset = new Image();
        this.fireTileset.src = "img/fireTileset.png";

        this.controller = controller;
        this.map = controller.map;
        this.player = controller.player;
        this.aliveBots = GameController.aliveBots;
        this.deadBots = GameController.deadBots;
        this.bulletsOnMap = GameController.bulletsOnMap;

        let renderBind = this.render.bind(this);

        this.fieldTileset.addEventListener("load", renderBind);
    }

    render() {
        this.drawMap();
        this.drawBullets();
        this.drawBots();
        this.drawPlayer();
        this.drawGates();
    }

    drawRotated(tileset, object) {
        this.gameMapContext.save();
        this.gameMapContext.translate(object.centerPoint.x, object.centerPoint.y);
        this.gameMapContext.rotate(object.angle);
        this.gameMapContext.drawImage(tileset,
            object.upLeftTilesetPosition.x, object.upLeftTilesetPosition.y,
            object.size.x, object.size.y, -object.centerOffset.x, -object.centerOffset.y,
            object.size.x, object.size.y);
        this.gameMapContext.restore();
    }

    drawMap() {
        for (let i = 0; i < this.map.height; i++) {
            for (let k = 0; k < this.map.width; k++) {
                this.gameMapContext.drawImage(this.fieldTileset, this.map.textureMap[i][k].x * scale,
                    this.map.textureMap[i][k].y * scale, scale, scale, k * scale, i * scale, scale, scale);
            }
        }

        //let mapObjectsBounds = this.map.field;
        //for (let i = 0; i < this.map.height * scale; i++) {
        //    for (let k = 0; k < this.map.width * scale; k++) {
        //        if (mapObjectsBounds[i][k].name == "cactus")
        //            this.gameMapContext.fillRect(k, i, 1, 1);
        //    }
        //}
    }

    drawPlayer() {
        this.drawRotated(this.playerTileset, this.player);

        //let pb = this.player.pointBounds;
        //for (let i = 0; i < pb.length - 1; i++) {
        //    this.gameMapContext.fillRect(pb[i].x, pb[i].y, 1, 1);
        //}
    }

    drawBullets() {
        this.bulletsOnMap.forEach(bullet => {
            this.drawRotated(this.fireTileset, bullet);
        });
    }

    drawBots() {
        this.deadBots.forEach(bot => {
            this.drawRotated(this.botTileset, bot);

            //let pb = bot.hitAreaBounds;
            //for (let i = 0; i < pb.length - 1; i++) {
            //    this.gameMapContext.fillRect(pb[i].x, pb[i].y, 1, 1);
            //}
        });
        this.aliveBots.forEach(bot => {
            this.drawRotated(this.botTileset, bot);
            this.drawHpBar(bot);

            //let pb = bot.hitAreaBounds;
            //for (let i = 0; i < pb.length - 1; i++) {
            //    this.gameMapContext.fillRect(pb[i].x, pb[i].y, 1, 1);
            //}
        });
    }

    drawHpBar(bot) {
        this.gameMapContext.globalAlpha = 0.3;
        this.gameMapContext.fillStyle = "black";
        this.gameMapContext.fillRect(bot.hpBar.position.x, bot.hpBar.position.y,
            bot.hpBar.maxWidth, bot.hpBar.height);

        this.gameMapContext.globalAlpha = 1;
        this.gameMapContext.fillStyle = "red";
        this.gameMapContext.fillRect(bot.hpBar.position.x, bot.hpBar.position.y,
            bot.hpBar.curWidth, bot.hpBar.height);
    }

    drawGates() {
        this.gameMapContext.drawImage(this.fieldTileset, 70,
            70, scale * 2, scale, this.map.gates.top.x, this.map.gates.top.y, scale * 2, scale);

        this.gameMapContext.drawImage(this.fieldTileset, 105,
            0, scale, scale * 2, this.map.gates.right.x - 34, this.map.gates.right.y, scale, scale * 2);

        this.gameMapContext.drawImage(this.fieldTileset, 70,
            105, scale * 2, scale, this.map.gates.bottom.x, this.map.gates.bottom.y - 34, scale * 2, scale);

        this.gameMapContext.drawImage(this.fieldTileset, 70,
            0, scale, scale * 2, this.map.gates.left.x, this.map.gates.left.y, scale, scale * 2);

        //let gateCheck = this.map.gatesCheck;
        //for (let i = 0; i < gateCheck.length; i++) {
        //    this.gameMapContext.fillRect(gateCheck[i].x, gateCheck[i].y, 1, 1);
        //}
    }
}