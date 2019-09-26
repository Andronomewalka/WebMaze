"use strict"

class TextManager {

    static directions = [new Point(0, -1), new Point(1, -1), new Point(1, 0), new Point(1, 1),
        new Point(0, 1), new Point(-1, 1), new Point(-1, 0), new Point(-1, -1)
    ];

    constructor() {
        this.manager = [];

        this.eraseTextCallbackBind = this.eraseTextCallback.bind(this);

        gameMap.addEventListener("processedCollision", e => this.addText(e.detail.report));
    }

    addText(collisionReport) {

        let color = collisionReport.isCrit ? "red" : "black";
        let font = collisionReport.isCrit ? "20px" : "12px";

        let direction = this.defineDirection();
        this.manager.push(new Text(collisionReport.damage, collisionReport.objectPosition,
            color, direction, font, this.eraseTextCallbackBind));
    }

    defineDirection() {
        return TextManager.directions[random(0, 8)];
    }

    eraseTextCallback(textObj) {

        let textId = this.manager.indexOf(textObj);
        this.manager.splice(textId, 1);
    }
}


class Text {

    static speed = 4;
    constructor(text, position, color, direction, font, endAnimationCallback) {
        this.content = text;
        this.position = position;
        this.color = color;
        this.direction = direction;
        this.font = font;
        this.animationCount = 15;
        this.curAnimation = 0;
        this.endAnimationCallback = endAnimationCallback;
        this.runTextAnimation();
    }

    runTextAnimation() {
        let positionChangeBind = this.positionChange.bind(this);
        this.animation = setInterval(positionChangeBind, 20);
    }

    positionChange() {
        if (this.curAnimation != this.animationCount) {
            this.position.x += this.direction.x * Text.speed;
            this.position.y += this.direction.y * Text.speed;
            this.curAnimation++;
        } else {
            clearInterval(this.animation);
            this.endAnimationCallback(this);
        }
    }
}