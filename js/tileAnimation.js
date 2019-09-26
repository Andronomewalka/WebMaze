"use strict"


class TileAnimation {
    constructor(currTile, xTileArray) {
        this.animationTileArray = xTileArray;
        this.currTile = currTile;
        this.currTileId = 0;
        this.animationDelay = 3;
        this.animationCurDelay = 3;
    }

    nextMoveTileAnimation(directionMoveX, directionMoveY, directionLook) {
        if (this.animationCurDelay == 0) {
            let directionMoveRad = radiansToVector();
            if (directionMoveRad - directionLook < 4 &&
                directionMoveRad - directionLook > 0) {

                if (this.currTileId + 1 == this.animationTileArray.length)
                    this.currTileId = 0;
                else
                    this.currTileId++;

            } else {

                if (this.currTileId - 1 == -1)
                    this.currTileId = this.animationTileArray.length - 1;
                else
                    this.currTileId--;

            }
            this.animationCurDelay = this.animationDelay;
        }
        this.animationCurDelay--;

        this.currTile.x = this.animationTileArray[this.currTileId];

        function radiansToVector() {
            return Math.atan2(directionMoveX, directionMoveY);
        }
    }

    runAnimationInterval(endCallback, animationDelay, ...theArgs) {
        let animationBind = animationBindFunc.bind(this);
        let animationTimer = setInterval(animationBind, animationDelay);

        function animationBindFunc() {

            if (this.currTileId + 1 == this.animationTileArray.length) {
                clearInterval(animationTimer);

                if (endCallback)
                    endCallback(...theArgs);

                this.currTileId = 0;
                return;
            }

            this.currTileId++;
            this.currTile.x = this.animationTileArray[this.currTileId];
        }
    }
}