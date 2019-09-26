"use strict"


class Render {
    constructor(controller) {
        gameMap.width = screen.availWidth;
        gameMap.height = screen.availHeight;
        this.gameMapContext = gameMap.getContext("2d");

        this.fieldTileset = new Image();
        this.fieldTileset.src = "img/fieldTileset.png";

        this.upPlayerTileset = new Image();
        this.upPlayerTileset.src = "img/upPlayerTileset2.png";

        this.downPlayerTileset = new Image();
        this.downPlayerTileset.src = "img/downPlayerTileset.png";

        this.botTileset = new Image();
        this.botTileset.src = "img/botTileset.png";

        this.fireTileset = new Image();
        this.fireTileset.src = "img/fireTileset.png";

        this.explTileset = new Image();
        this.explTileset.src = "img/explTileset2.png";

        this.map = controller.map;
        this.player = controller.player;
        this.aliveBots = controller.aliveBots;
        this.deadBots = controller.deadBots;
        this.bulletsOnMap = controller.bulletsOnMap;
        this.textManager = controller.textManager;
        this.statistics = controller.statistics;

        this.gameMapContext.font = "12px Arial";

        let renderBind = this.render.bind(this);

        this.fieldTileset.addEventListener("load", renderBind);
    }

    render() {
        this.drawMap();
        this.drawBots();
        this.drawBullets();
        this.drawGates();
        this.drawPlayer();
        this.drawText();
        this.drawStatistics();
        //this.drawDebug();
    }

    drawRotated(tileset, visual) {
        this.gameMapContext.save();
        this.gameMapContext.translate(visual.centerPoint.x, visual.centerPoint.y);
        this.gameMapContext.rotate(visual.angle);
        this.gameMapContext.drawImage(tileset,
            visual.upLeftTilesetPosition.x, visual.upLeftTilesetPosition.y,
            visual.size.x, visual.size.y, -visual.centerOffset.x, -visual.centerOffset.y,
            visual.size.x, visual.size.y);
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
        this.drawRotated(this.upPlayerTileset, this.player.visualHands);
        this.drawRotated(this.downPlayerTileset, this.player.visualBody);


        //hp
        this.drawProgressBar(this.player.hpBar, "red");
        this.gameMapContext.drawImage(this.fieldTileset, 140, 70, scale, scale,
            this.player.hpBar.position.x - 28, this.player.hpBar.position.y - 17, scale - 6, scale - 6);

        this.gameMapContext.fillStyle = "white";
        this.gameMapContext.fillText(this.player.curHp + "/" + this.player.maxHp,
            this.player.hpBar.position.x + 7, this.player.hpBar.position.y + 10);


        //ammo
        this.drawProgressBar(this.player.clipBar, "#58789c");
        this.gameMapContext.drawImage(this.fieldTileset, 140, 105, scale, scale,
            this.player.clipBar.position.x - 28, this.player.clipBar.position.y - 18, scale - 6, scale - 6);

        this.gameMapContext.fillStyle = "white";
        this.gameMapContext.fillText(this.player.bulletsInClip + "/∞",
            this.player.clipBar.position.x + 7, this.player.clipBar.position.y + 10);


        //let pb = this.player.pointBounds;
        //for (let i = 0; i < pb.length - 1; i++) {
        //    this.gameMapContext.fillRect(pb[i].x, pb[i].y, 1, 1);
        //}
    }

    drawText() {
        this.gameMapContext.font = "bold 12px Arial";

        this.textManager.manager.forEach(text => {
            this.gameMapContext.fillStyle = text.color;
            this.gameMapContext.font = `bold ${text.font} Arial`;
            this.gameMapContext.fillText(text.content, text.position.x, text.position.y);
        });

        this.gameMapContext.font = "12px Arial";

    }

    drawBullets() {
        this.bulletsOnMap.forEach(bullet => {
            if (bullet.inExplosiveAnimation) {
                bullet.visualExpl.updateCenterPoint(this.player.gunPoint);
                this.drawRotated(this.fireTileset, bullet.visualExpl);
            }

            this.drawRotated(this.fireTileset, bullet.visualBullet);
        });
    }

    drawBots() {
        this.deadBots.forEach(bot => {
            this.drawRotated(this.botTileset, bot.visual);

            //let pb = bot.hitAreaBounds;
            //for (let i = 0; i < pb.length - 1; i++) {
            //    this.gameMapContext.fillRect(pb[i].x, pb[i].y, 1, 1);
            //}
        });
        this.aliveBots.forEach(bot => {
            this.drawRotated(this.botTileset, bot.visual);
            this.drawProgressBar(bot.hpBar, "red");

            //let pb = bot.hitAreaBounds;
            //for (let i = 0; i < pb.length - 1; i++) {
            //    this.gameMapContext.fillRect(pb[i].x, pb[i].y, 1, 1);
            //}
        });
    }

    drawProgressBar(bar, color) {
        this.gameMapContext.globalAlpha = 0.3;
        this.gameMapContext.fillStyle = "black";
        this.gameMapContext.fillRect(bar.position.x, bar.position.y,
            bar.maxWidth, bar.height);

        this.gameMapContext.globalAlpha = 1;
        this.gameMapContext.fillStyle = color;
        this.gameMapContext.fillRect(bar.position.x, bar.position.y,
            bar.curWidth, bar.height);
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

    drawDebug() {
        //this.gameMapContext.fillStyle = "white";
        //this.gameMapContext.font = "12px Arial";

        //this.gameMapContext.fillText("direction view: " +
        //    this.player.angle.toFixed(2) + ", direction move: " +
        //    Math.atan2(this.player.direction.x, this.player.direction.y).toFixed(2),
        //    50, 700);

        //this.gameMapContext.fillText("direction view: " +
        //    Math.sin(this.player.angle).toFixed(2) + " " + -Math.cos(this.player.angle).toFixed(2) +
        //    ", direction move: " + this.player.direction.x + " " + this.player.direction.y,
        //    50, 730);
    }

    drawStatistics() {

        this.gameMapContext.font = `bold 16px Arial`;
        this.gameMapContext.fillText("Bots left : " + this.statistics.botsLeft, 60, 700);

        if (this.statistics.isGameEnd()) {
            this.gameMapContext.font = `bold 26px Arial`;
            this.gameMapContext.fillText("VICTORY", this.map.width * scale / 2 - 100,
                this.map.height * scale / 2 - 30);
        }

        this.gameMapContext.font = `12px Arial`;
    }
}