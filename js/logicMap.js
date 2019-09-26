"use strict"

class LogicMap {

    // создаём объекты, для того, чтоб держать ссылки на элементы в матрице координат, а не копии
    static background = { name: "background" };
    static wall = { name: "wall" };
    static space = { name: "space" };
    static cactus = { name: "cactus" };
    static stone1 = { name: "stone1" };
    static stone2 = { name: "stone2" };
    static gate = { name: "gate" };

    constructor(height, width) {

        let gates = {
            top: new Point(0, 0),
            right: new Point(0, 0),
            bottom: new Point(0, 0),
            left: new Point(0, 0)
        };
        // let gatesCheck = [];

        let binaryMap;
        let bfield;
        let field;
        let textureMap;

        let mapIsReady = false;
        while (!mapIsReady) {
            binaryMap = createBinaryMap();
            bfield = binaryMap.binaryField;
            field = [];
            for (let i = 0; i < height * scale; i++)
                field[i] = [];
            textureMap = [];

            createTextureMap();
            addDecorToTexureMap();

            if (!addGates())
                continue;

            mapIsReady = true;
        }

        this.binaryField = binaryMap.binaryField;
        this.field = field;
        this.textureMap = textureMap;
        this.gates = gates;
        this.height = height;
        this.width = width;
        // this.gatesCheck = gatesCheck;

        function createBinaryMap() {
            return new BinaryMap(height, width);
        }

        function createTextureMap() {

            let curX = 0;
            let curY = 0;
            let curField = null;

            for (let i = 0; i < height; i++) {
                textureMap.push([]);
                for (let k = 0; k < width; k++) {

                    if (bfield[i][k] == true) {
                        textureMap[i].push(new Point(0, 1));
                        curField = LogicMap.space;
                    } else if ((i - 1 < 0 || k - 1 < 0 ? false : bfield[i - 1][k - 1]) == false &&
                        (i - 1 < 0 ? false : bfield[i - 1][k]) == false &&
                        (i - 1 < 0 || k + 1 >= width ? false : bfield[i - 1][k + 1]) == false &&
                        (k + 1 >= width ? false : bfield[i][k + 1]) == false &&
                        (i + 1 >= height || k + 1 >= width ? false : bfield[i + 1][k + 1]) == false &&
                        (i + 1 >= height ? false : bfield[i + 1][k]) == false &&
                        (i + 1 >= height || k - 1 < 0 ? false : bfield[i + 1][k - 1]) == false &&
                        (k - 1 < 0 ? false : bfield[i][k - 1]) == false) {
                        textureMap[i].push(new Point(1, 2));
                        curField = LogicMap.background;
                    } else if (bfield[i][k] == false) {
                        textureMap[i].push(new Point(0, 0));
                        curField = LogicMap.wall;
                    }
                    fillField(curX, curY, curX + scale, curY + scale, curField);
                    curX += scale;
                }
                curX = 0;
                curY += scale;
            }
        }

        function fillField(fromX, fromY, toX, toY, curField) {
            for (let i = fromY; i <= toY; i++) {
                for (let k = fromX; k < toX; k++) {
                    if (i == height * scale || k == width * scale)
                        return;
                    field[i][k] = curField;
                }
            }
        }

        function addDecorToTexureMap() {
            let stone1Count = random(2, 6);
            let stone2Count = random(1, 5);
            let cactusCount = random(2, 4);


            for (let index = 0; index < stone1Count; index++) {
                let isPlaceFound = false;
                let randomTileUpLeft = new Point();
                while (!isPlaceFound) {
                    randomTileUpLeft.x = random(0, width);
                    randomTileUpLeft.y = random(0, height);
                    if (field[randomTileUpLeft.y * scale][randomTileUpLeft.x * scale].name == "space" && // space tile
                        field[randomTileUpLeft.y * scale + 17][randomTileUpLeft.x * scale].name == "space" &&
                        field[randomTileUpLeft.y * scale + 35][randomTileUpLeft.x * scale].name == "space" &&
                        field[randomTileUpLeft.y * scale][randomTileUpLeft.x * scale + 17].name == "space" &&
                        field[randomTileUpLeft.y * scale + 17][randomTileUpLeft.x * scale + 17].name == "space" &&
                        field[randomTileUpLeft.y * scale + 35][randomTileUpLeft.x * scale + 17].name == "space" &&
                        field[randomTileUpLeft.y * scale][randomTileUpLeft.x * scale + 35].name == "space" &&
                        field[randomTileUpLeft.y * scale + 17][randomTileUpLeft.x * scale + 35].name == "space" &&
                        field[randomTileUpLeft.y * scale + 35][randomTileUpLeft.x * scale + 35].name == "space") {
                        textureMap[randomTileUpLeft.y][randomTileUpLeft.x] = new Point(0, 2);
                        isPlaceFound = true;
                    }
                }
                fillStone1(randomTileUpLeft.x * scale, randomTileUpLeft.y * scale);
            }

            for (let index = 0; index < stone2Count; index++) {
                let isPlaceFound = false;
                let randomTileUpLeft = new Point();
                while (!isPlaceFound) {
                    randomTileUpLeft.x = random(0, width);
                    randomTileUpLeft.y = random(0, height);
                    if (field[randomTileUpLeft.y * scale][randomTileUpLeft.x * scale].name == "space" && // space tile
                        field[randomTileUpLeft.y * scale + 17][randomTileUpLeft.x * scale].name == "space" &&
                        field[randomTileUpLeft.y * scale + 35][randomTileUpLeft.x * scale].name == "space" &&
                        field[randomTileUpLeft.y * scale][randomTileUpLeft.x * scale + 17].name == "space" &&
                        field[randomTileUpLeft.y * scale + 17][randomTileUpLeft.x * scale + 17].name == "space" &&
                        field[randomTileUpLeft.y * scale + 35][randomTileUpLeft.x * scale + 17].name == "space" &&
                        field[randomTileUpLeft.y * scale][randomTileUpLeft.x * scale + 35].name == "space" &&
                        field[randomTileUpLeft.y * scale + 17][randomTileUpLeft.x * scale + 35].name == "space" &&
                        field[randomTileUpLeft.y * scale + 35][randomTileUpLeft.x * scale + 35].name == "space") {
                        textureMap[randomTileUpLeft.y][randomTileUpLeft.x] = new Point(0, 3);
                        isPlaceFound = true;
                    }
                }
                fillStone2(randomTileUpLeft.x * scale, randomTileUpLeft.y * scale);
            }

            for (let index = 0; index < cactusCount; index++) {
                let isPlaceFound = false;
                let randomTileUpLeft = new Point();
                while (!isPlaceFound) {
                    randomTileUpLeft.x = random(0, width);
                    randomTileUpLeft.y = random(0, height);
                    if (field[randomTileUpLeft.y * scale][randomTileUpLeft.x * scale].name == "space" && // space tile
                        field[randomTileUpLeft.y * scale + 17][randomTileUpLeft.x * scale].name == "space" &&
                        field[randomTileUpLeft.y * scale + 35][randomTileUpLeft.x * scale].name == "space" &&
                        field[randomTileUpLeft.y * scale + 52][randomTileUpLeft.x * scale].name == "space" &&
                        field[randomTileUpLeft.y * scale + 70][randomTileUpLeft.x * scale].name == "space" &&
                        field[randomTileUpLeft.y * scale][randomTileUpLeft.x * scale + 17].name == "space" &&
                        field[randomTileUpLeft.y * scale + 17][randomTileUpLeft.x * scale + 17].name == "space" &&
                        field[randomTileUpLeft.y * scale + 35][randomTileUpLeft.x * scale + 17].name == "space" &&
                        field[randomTileUpLeft.y * scale + 52][randomTileUpLeft.x * scale + 17].name == "space" &&
                        field[randomTileUpLeft.y * scale + 70][randomTileUpLeft.x * scale + 17].name == "space" &&
                        field[randomTileUpLeft.y * scale][randomTileUpLeft.x * scale + 35].name == "space" &&
                        field[randomTileUpLeft.y * scale + 17][randomTileUpLeft.x * scale + 35].name == "space" &&
                        field[randomTileUpLeft.y * scale + 35][randomTileUpLeft.x * scale + 35].name == "space" &&
                        field[randomTileUpLeft.y * scale + 52][randomTileUpLeft.x * scale + 35].name == "space" &&
                        field[randomTileUpLeft.y * scale + 70][randomTileUpLeft.x * scale + 35].name == "space") {
                        textureMap[randomTileUpLeft.y][randomTileUpLeft.x] = new Point(1, 0);
                        textureMap[randomTileUpLeft.y + 1][randomTileUpLeft.x] = new Point(1, 1);
                        isPlaceFound = true;
                    }
                }
                fillCactus(randomTileUpLeft.x * scale, randomTileUpLeft.y * scale);
            }

            function fillStone1(x, y) {
                let rightBound = 23;
                let leftBound = 16;
                for (let i = 0; i < 18; i++) {
                    for (let k = 0; k < 35; k++) {
                        if (k > leftBound && k < rightBound)
                            field[y + i][x + k] = LogicMap.stone1;
                    }
                    leftBound--;
                    rightBound++;
                }

                for (let i = 18; i < 35; i++) {
                    for (let k = 0; k < 34; k++) {
                        if (k > leftBound && k < rightBound)
                            field[y + i][x + k] = LogicMap.stone1;
                    }
                    leftBound++;
                    rightBound--;
                }

            }

            function fillStone2(x, y) {
                let rightBound = 21;
                let leftBound = 17;
                for (let i = 0; i < 18; i++) {
                    for (let k = 0; k < 35; k++) {
                        if (k > leftBound && k < rightBound)
                            field[y + i][x + k] = LogicMap.stone2;
                    }
                    leftBound--;
                    rightBound++;
                }

                for (let i = 18; i < 35; i++) {
                    for (let k = 0; k < 34; k++) {
                        if (k > leftBound && k < rightBound)
                            field[y + i][x + k] = LogicMap.stone2;
                    }
                    leftBound++;
                    rightBound -= 2;
                }

            }

            function fillCactus(x, y) {
                let rightBound = 16;
                let leftBound = 10;
                let spread = true;
                for (let i = 0; i < 15; i++) {
                    for (let k = 0; k < 25; k++) {
                        if (k > leftBound && k < rightBound)
                            field[y + i][x + k] = LogicMap.cactus;
                    }
                    if (spread) {
                        leftBound--;
                        rightBound++;
                    }
                    spread = !spread;
                }

                for (let i = 15; i < 35; i++) {
                    for (let k = 1; k < 25; k++) {
                        field[y + i][x + k] = LogicMap.cactus;
                    }
                }

                for (let i = 35; i < 56; i++) {
                    for (let k = 0; k < 35; k++) {
                        if (k > leftBound && k < rightBound)
                            field[y + i][x + k] = LogicMap.cactus;
                    }
                    if (spread) {
                        leftBound++;
                        rightBound--;
                    }
                    spread = !spread;
                }


                for (let i = 56; i < 63; i++) {
                    for (let k = 10; k < 17; k++) {
                        field[y + i][x + k] = LogicMap.cactus;
                    }
                }
            }
        }

        function addGates() {
            let horizontalCenter = field[0].length / 2;
            let verticalCenter = field.length / 2;

            if (!addTopGate(horizontalCenter) ||
                !addRightGate(verticalCenter) ||
                !addBottomGate(horizontalCenter) ||
                !addLeftGate(verticalCenter))
                return false;

            return true;

            function addTopGate(horizontalCenter) {

                for (let itry = 0; itry < 100; itry++) {

                    let horRand = Math.round(random(horizontalCenter - horizontalCenter / 2, horizontalCenter + horizontalCenter / 2));
                    for (let i = 0; i < field.length; i += 35) {
                        if (field[i][horRand].name == "wall" &&
                            field[i][horRand + 70].name == "wall" &&
                            field[i][horRand + 105].name == "wall" &&

                            field[i + 40][horRand - 15].name == "space" &&
                            field[i + 40][horRand].name == "space" &&
                            field[i + 40][horRand + 15].name == "space" &&
                            field[i + 40][horRand + 30].name == "space" &&
                            field[i + 40][horRand + 45].name == "space" &&
                            field[i + 40][horRand + 60].name == "space" &&
                            field[i + 40][horRand + 75].name == "space" &&

                            field[i + 55][horRand - 15].name == "space" &&
                            field[i + 55][horRand].name == "space" &&
                            field[i + 55][horRand + 15].name == "space" &&
                            field[i + 55][horRand + 30].name == "space" &&
                            field[i + 55][horRand + 45].name == "space" &&
                            field[i + 55][horRand + 60].name == "space" &&
                            field[i + 55][horRand + 75].name == "space" &&

                            field[i + 70][horRand - 15].name == "space" &&
                            field[i + 70][horRand].name == "space" &&
                            field[i + 70][horRand + 15].name == "space" &&
                            field[i + 70][horRand + 30].name == "space" &&
                            field[i + 70][horRand + 45].name == "space" &&
                            field[i + 70][horRand + 60].name == "space" &&
                            field[i + 70][horRand + 75].name == "space" &&

                            field[i + 85][horRand - 15].name == "space" &&
                            field[i + 85][horRand].name == "space" &&
                            field[i + 85][horRand + 15].name == "space" &&
                            field[i + 85][horRand + 30].name == "space" &&
                            field[i + 85][horRand + 45].name == "space" &&
                            field[i + 85][horRand + 60].name == "space" &&
                            field[i + 85][horRand + 75].name == "space") {

                            gates.top = new Point(horRand, i);

                            fillField(horRand, i, horRand + 70, i + 35, LogicMap.gate);
                            return true;

                        } else if (field[i][horRand].name == "space") {
                            break;
                        }
                    }
                }
                return false;
            }

            function addRightGate(verticalCenter) {

                for (let itry = 0; itry < 100; itry++) {

                    let vertRand = Math.round(random(verticalCenter - verticalCenter / 2, verticalCenter + verticalCenter / 2));
                    for (let i = field[0].length - 1; i > 0; i -= 35) {
                        if (field[vertRand][i].name == "wall" &&
                            field[vertRand + 35][i].name == "wall" &&
                            field[vertRand + 70][i].name == "wall" &&

                            field[vertRand - 15][i - 45].name == "space" &&
                            field[vertRand][i - 45].name == "space" &&
                            field[vertRand + 15][i - 45].name == "space" &&
                            field[vertRand + 30][i - 45].name == "space" &&
                            field[vertRand + 45][i - 45].name == "space" &&
                            field[vertRand + 60][i - 45].name == "space" &&
                            field[vertRand + 75][i - 45].name == "space" &&

                            field[vertRand - 15][i - 60].name == "space" &&
                            field[vertRand][i - 60].name == "space" &&
                            field[vertRand + 15][i - 60].name == "space" &&
                            field[vertRand + 30][i - 60].name == "space" &&
                            field[vertRand + 45][i - 60].name == "space" &&
                            field[vertRand + 60][i - 60].name == "space" &&
                            field[vertRand + 75][i - 60].name == "space" &&

                            field[vertRand - 15][i - 75].name == "space" &&
                            field[vertRand][i - 75].name == "space" &&
                            field[vertRand + 15][i - 75].name == "space" &&
                            field[vertRand + 30][i - 75].name == "space" &&
                            field[vertRand + 45][i - 75].name == "space" &&
                            field[vertRand + 60][i - 75].name == "space" &&
                            field[vertRand + 75][i - 75].name == "space") {

                            gates.right = new Point(i, vertRand);

                            fillField(i - 35, vertRand, i, vertRand + 70, LogicMap.gate);
                            return true;

                        } else if (field[vertRand][i].name == "space") {
                            break;
                        }
                    }
                }
                return false;
            }

            function addBottomGate(horizontalCenter) {

                for (let itry = 0; itry < 100; itry++) {

                    let horRand = Math.round(random(horizontalCenter - horizontalCenter / 2, horizontalCenter + horizontalCenter / 2));
                    for (let i = field.length - 1; i > 0; i -= 35) {
                        if (field[i][horRand].name == "wall" &&
                            field[i][horRand + 70].name == "wall" &&
                            field[i][horRand + 105].name == "wall" &&

                            field[i - 40][horRand - 15].name == "space" &&
                            field[i - 40][horRand].name == "space" &&
                            field[i - 40][horRand + 15].name == "space" &&
                            field[i - 40][horRand + 30].name == "space" &&
                            field[i - 40][horRand + 45].name == "space" &&
                            field[i - 40][horRand + 60].name == "space" &&
                            field[i - 40][horRand + 75].name == "space" &&

                            field[i - 55][horRand - 15].name == "space" &&
                            field[i - 55][horRand].name == "space" &&
                            field[i - 55][horRand + 15].name == "space" &&
                            field[i - 55][horRand + 30].name == "space" &&
                            field[i - 55][horRand + 45].name == "space" &&
                            field[i - 55][horRand + 60].name == "space" &&
                            field[i - 55][horRand + 75].name == "space" &&

                            field[i - 70][horRand - 15].name == "space" &&
                            field[i - 70][horRand].name == "space" &&
                            field[i - 70][horRand + 15].name == "space" &&
                            field[i - 70][horRand + 30].name == "space" &&
                            field[i - 70][horRand + 45].name == "space" &&
                            field[i - 70][horRand + 60].name == "space" &&
                            field[i - 70][horRand + 75].name == "space" &&

                            field[i - 85][horRand - 15].name == "space" &&
                            field[i - 85][horRand].name == "space" &&
                            field[i - 85][horRand + 15].name == "space" &&
                            field[i - 85][horRand + 30].name == "space" &&
                            field[i - 85][horRand + 45].name == "space" &&
                            field[i - 85][horRand + 60].name == "space" &&
                            field[i - 85][horRand + 75].name == "space") {

                            gates.bottom = new Point(horRand, i);

                            fillField(horRand, i - 35, horRand + 70, i, LogicMap.gate);
                            return true;

                        } else if (field[i][horRand].name == "space") {
                            break;
                        }
                    }
                }
                return false;
            }

            function addLeftGate(verticalCenter) {

                for (let itry = 0; itry < 100; itry++) {

                    let vertRand = Math.round(random(verticalCenter - verticalCenter / 2, verticalCenter + verticalCenter / 2));
                    for (let i = 0; i < field[0].length; i += 35) {
                        if (field[vertRand][i].name == "wall" &&
                            field[vertRand + 35][i].name == "wall" &&
                            field[vertRand + 70][i].name == "wall" &&

                            field[vertRand - 15][i + 45].name == "space" &&
                            field[vertRand][i + 45].name == "space" &&
                            field[vertRand + 15][i + 45].name == "space" &&
                            field[vertRand + 30][i + 45].name == "space" &&
                            field[vertRand + 45][i + 45].name == "space" &&
                            field[vertRand + 60][i + 45].name == "space" &&
                            field[vertRand + 75][i + 45].name == "space" &&

                            field[vertRand - 15][i + 60].name == "space" &&
                            field[vertRand][i + 60].name == "space" &&
                            field[vertRand + 15][i + 60].name == "space" &&
                            field[vertRand + 30][i + 60].name == "space" &&
                            field[vertRand + 45][i + 60].name == "space" &&
                            field[vertRand + 60][i + 60].name == "space" &&
                            field[vertRand + 75][i + 60].name == "space" &&

                            field[vertRand - 15][i + 75].name == "space" &&
                            field[vertRand][i + 75].name == "space" &&
                            field[vertRand + 15][i + 75].name == "space" &&
                            field[vertRand + 30][i + 75].name == "space" &&
                            field[vertRand + 45][i + 75].name == "space" &&
                            field[vertRand + 60][i + 75].name == "space" &&
                            field[vertRand + 75][i + 75].name == "space") {

                            gates.left = new Point(i, vertRand);

                            fillField(i, vertRand, i + 35, vertRand + 70, LogicMap.gate);
                            return true;

                        } else if (field[vertRand][i].name == "space") {
                            break;
                        }
                    }
                }
                return false;
            }
        }
    }
}