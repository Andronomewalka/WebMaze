"use strict"


class BinaryMap {

    constructor(height, width) {

        let rooms = [];
        let roomUnion = [];

        let binaryField = [];

        for (let i = 0; i < height; i++) {
            binaryField[i] = [];
            for (let k = 0; k < width; k++)
                binaryField[i][k] = false;
        }

        function Room(upLeft, downRight) {
            return {
                upLeft: upLeft,
                downRight: downRight
            }
        }

        function random(min, max) {
            return parseInt(Math.floor(Math.random() * (max - min)) + min, 10);
        }

        function generateSingleRoomUnion() {
            rooms.forEach(room => {
                if (!roomUnion.includes(roomUnion.find(cur => cur.includes(room)))) {
                    let newUnion = [room];
                    roomUnion.push(newUnion);
                }
            });
        }

        function fillRoomBounds(room) {
            for (let i = room.upLeft.y; i <= room.downRight.y; i++)
                for (let k = room.upLeft.x; k <= room.downRight.x; k++)
                    binaryField[i][k] = true;
        }

        function сheckCollision(forRoom) {
            rooms.forEach(room => {
                // ищем пересечение комнат по отношению к room
                if ((room.upLeft.x <= forRoom.upLeft.x // справа вверху
                        &&
                        room.downRight.x >= forRoom.upLeft.x &&
                        room.upLeft.y <= forRoom.downRight.y &&
                        room.downRight.y >= forRoom.downRight.y) ||
                    (room.upLeft.x <= forRoom.upLeft.x // справа внизу
                        &&
                        room.downRight.x >= forRoom.upLeft.x &&
                        room.upLeft.y <= forRoom.upLeft.y &&
                        room.downRight.y >= forRoom.upLeft.y) ||
                    (room.upLeft.x <= forRoom.downRight.x // слева вверху
                        &&
                        room.downRight.x >= forRoom.downRight.x &&
                        room.upLeft.y <= forRoom.downRight.y &&
                        room.downRight.y >= forRoom.downRight.y) ||
                    (room.upLeft.x <= forRoom.downRight.x // слева внизу
                        &&
                        room.downRight.x >= forRoom.downRight.x &&
                        room.upLeft.y <= forRoom.upLeft.y &&
                        room.downRight.y >= forRoom.upLeft.y)) {
                    // ищем не содержится ли room или forRoom в существующих коллекциях объединений,
                    // и: 1) либо добавляем чего не хватает,
                    //    2) либо создаём такую коллекцию, если ни того ни другого не найдно
                    //    3) либо не добавляем ничего, если оба элемента уже находятся в ОДНОМ объединении

                    // room и forRoom могут содержаться в разных объдинениях, поэтому нужно отдельно 
                    // провести поиск обоих элементов в рамках одной коллекции
                    let roomAndForRoomFound =
                        roomUnion.includes(
                            roomUnion.find(curRoomList => curRoomList.includes(room) && curRoomList.includes(forRoom)));

                    if (roomAndForRoomFound)
                        return;

                    let roomFound = roomUnion.find(curRoomList => curRoomList.includes(room));
                    let forRoomFound = roomUnion.find(curRoomList => curRoomList.includes(forRoom));

                    // комната объединяет объединения
                    if (forRoomFound != null && roomFound != null) {
                        let newUinon = [];

                        roomFound.forEach(room => { newUinon.push(room) });
                        forRoomFound.forEach(room => { newUinon.push(room) });

                        roomUnion.splice(roomUnion.indexOf(roomFound), 1);
                        roomUnion.splice(forRoomFound.indexOf(roomFound), 1);

                        roomUnion.push(newUinon);
                    }

                    if (forRoomFound != null)
                        forRoomFound.push(room);

                    else if (roomFound != null)
                        roomFound.push(forRoom);

                    else {
                        let newUnion = [room, forRoom];
                        roomUnion.push(newUnion);
                    }
                }
            });
        }

        function generateBridges() {
            // определяем крайние границы объединения
            let connectors = defineConnectors();

            connectors.forEach(item => {
                // 0 - лево, 1 - право, 2 - верх, 3 - низ
                // проверяем существует ли путь от крайней стены в соответствующую сторону 
                // если соединение угловое, определяем его конечную точку в методах типа Exist

                let endPoint;

                endPoint = leftDownBridgeExist(item[0]);
                if (endPoint)
                    leftDownBridgeCreate(item[0], endPoint);

                if (leftBridgeExist(item[0]))
                    leftBridgeCreate(item[0]);

                endPoint = leftUpBridgeExist(item[0]);
                if (endPoint)
                    leftUpBridgeCreate(item[0], endPoint);

                endPoint = rightDownBridgeExist(item[1]);
                if (endPoint)
                    rightDownBridgeCreate(item[1], endPoint);

                if (rightBridgeExist(item[1]))
                    rightBridgeCreate(item[1]);

                endPoint = rightUpBridgeExist(item[1]);
                if (endPoint)
                    rightUpBridgeCreate(item[1], endPoint);

                endPoint = upLeftBridgeExist(item[2]);
                if (endPoint)
                    upLeftBridgeCreate(item[2], endPoint);

                if (upBridgeExist(item[2]))
                    upBridgeCreate(item[2]);

                endPoint = upRightBridgeExist(item[2]);
                if (endPoint)
                    upRightBridgeCreate(item[2], endPoint);

                endPoint = downLeftBridgeExist(item[3]);
                if (endPoint)
                    downLeftBridgeCreate(item[3], endPoint);

                if (downBridgeExist(item[3]))
                    downBridgeCreate(item[3]);

                endPoint = downRightBridgeExist(item[3]);
                if (endPoint)
                    downRightBridgeCreate(item[3], endPoint);
            });
        }

        function downRightBridgeCreate(downBound, endPoint) {
            for (let i = downBound.y + 1; i <= endPoint.y; i++) {
                binaryField[i][downBound.x] = true;
                binaryField[i][downBound.x + 1] = true;
            }
            for (let i = downBound.x; i <= endPoint.x; i++) {
                binaryField[endPoint.y][i] = true;
                binaryField[endPoint.y + 1][i] = true;
            }
        }

        function downRightBridgeExist(downBound) {
            for (let i = downBound.y + 2; i < height; i++) {
                for (let k = downBound.x; k < width; k++) {
                    if (binaryField[i][k] == false || binaryField[i + 1][k] == false)
                        continue;

                    return new Point(k, i);
                }
            }
            return false;
        }

        function downBridgeCreate(downBound) {
            for (let i = downBound.y + 1; i < height; i++) {
                if (binaryField[i][downBound.x] == true && binaryField[i][downBound.x + 1] == true)
                    break;

                binaryField[i][downBound.x] = true;
                binaryField[i][downBound.x + 1] = true;
            }
        }

        function downBridgeExist(downBound) {
            for (let i = downBound.y + 1; i < height; i++) {
                if (binaryField[i][downBound.x] == false || binaryField[i][downBound.x + 1] == false)
                    continue;
                return true;
            }
            return false;
        }

        function downLeftBridgeCreate(downBound, endPoint) {
            for (let i = downBound.y + 1; i <= endPoint.y; i++) {
                binaryField[i][downBound.x] = true;
                binaryField[i][downBound.x + 1] = true;
            }
            for (let i = downBound.x; i >= endPoint.x; i--) {
                binaryField[endPoint.y][i] = true;
                binaryField[endPoint.y + 1][i] = true;
            }
        }

        function downLeftBridgeExist(downBound, endPoint) {
            for (let i = downBound.y + 2; i < height; i++) {
                for (let k = downBound.x; k > 0; k--) {
                    if (binaryField[i][k] == false || binaryField[i + 1][k] == false)
                        continue;

                    return new Point(k, i);
                }
            }
            return false;
        }

        function upRightBridgeCreate(upBound, endPoint) {
            for (let i = upBound.y - 1; i >= endPoint.y; i--) {
                binaryField[i][upBound.x] = true;
                binaryField[i][upBound.x + 1] = true;
            }
            for (let i = upBound.x; i <= endPoint.x; i++) {
                binaryField[endPoint.y][i] = true;
                binaryField[endPoint.y + 1][i] = true;
            }
        }

        function upRightBridgeExist(upBound) {
            for (let i = upBound.y - 2; i > 0; i--) {
                for (let k = upBound.x; k < width; k++) {
                    if (binaryField[i][k] == false || binaryField[i + 1][k] == false)
                        continue;

                    return new Point(k, i);
                }
            }
            return false;
        }

        function upBridgeCreate(upBound) {
            for (let i = upBound.y - 1; i > 0; i--) {
                if (binaryField[i][upBound.x] == true && binaryField[i][upBound.x + 1] == true)
                    break;

                binaryField[i][upBound.x] = true;
                binaryField[i][upBound.x + 1] = true;
            }
        }

        function upBridgeExist(upBound) {
            for (let i = upBound.y - 1; i > 0; i--) {
                if (binaryField[i][upBound.x] == false || binaryField[i][upBound.x + 1] == false)
                    continue;
                return true;
            }
            return false;
        }

        function upLeftBridgeCreate(upBound, endPoint) {
            for (let i = upBound.y - 1; i >= endPoint.y; i--) {
                binaryField[i][upBound.x] = true;
                binaryField[i][upBound.x + 1] = true;
            }
            for (let i = upBound.x; i >= endPoint.x; i--) {
                binaryField[endPoint.y][i] = true;
                binaryField[endPoint.y + 1][i] = true;
            }
        }

        function upLeftBridgeExist(upBound, endPoint) {
            for (let i = upBound.y - 2; i > 0; i--) {
                for (let k = upBound.x; k > 0; k--) {
                    if (binaryField[i][k] == false || binaryField[i + 1, k] == false)
                        continue;

                    return new Point(k, i);
                }
            }
            return false;
        }

        function rightUpBridgeCreate(rightBound, endPoint) {
            for (let i = rightBound.x + 1; i <= endPoint.x; i++) {
                binaryField[rightBound.y][i] = true;
                binaryField[rightBound.y + 1][i] = true;
            }
            for (let i = rightBound.y; i >= endPoint.y; i--) {
                binaryField[i][endPoint.x] = true;
                binaryField[i][endPoint.x + 1] = true;
            }
        }

        function rightUpBridgeExist(rightBound) {
            for (let i = rightBound.x + 2; i < width; i++) {
                for (let k = rightBound.y; k > 0; k--) {
                    if (i + 1 > width - 1)
                        break;

                    if (binaryField[k][i] == false || binaryField[k][i + 1] == false)
                        continue;

                    return new Point(i, k);
                }
            }
            return false;
        }

        function rightBridgeCreate(rightBound) {
            for (let i = rightBound.x + 1; i < width; i++) {
                if (binaryField[rightBound.y][i] == true && binaryField[rightBound.y + 1][i] == true)
                    break;

                binaryField[rightBound.y][i] = true;
                binaryField[rightBound.y + 1][i] = true;
            }
        }

        function rightBridgeExist(rightBound) {
            for (let i = rightBound.x + 1; i < width; i++) {
                if (binaryField[rightBound.y][i] == false || binaryField[rightBound.y + 1][i] == false)
                    continue;
                return true;
            }
            return false;
        }

        function rightDownBridgeCreate(rightBound, endPoint) {
            for (let i = rightBound.x + 1; i <= endPoint.x; i++) {
                binaryField[rightBound.y][i] = true;
                binaryField[rightBound.y + 1][i] = true;
            }
            for (let i = rightBound.y; i <= endPoint.y; i++) {
                binaryField[i][endPoint.x] = true;
                binaryField[i][endPoint.x + 1] = true;
            }
        }

        function rightDownBridgeExist(rightBound) {
            for (let i = rightBound.x + 2; i < width; i++) {
                for (let k = rightBound.y; k < height; k++) {
                    if (i + 1 > width - 1)
                        break;

                    if (binaryField[k][i] == false || binaryField[k][i + 1] == false)
                        continue;

                    return new Point(i, k);
                }
            }
            return false;
        }

        function leftUpBridgeCreate(leftBound, endPoint) {
            for (let i = leftBound.x - 1; i >= endPoint.x; i--) {
                binaryField[leftBound.y][i] = true;
                binaryField[leftBound.y + 1][i] = true;
            }
            for (let i = leftBound.y; i >= endPoint.y; i--) {
                binaryField[i][endPoint.x] = true;
                binaryField[i][endPoint.x - 1] = true;
            }
        }

        function leftUpBridgeExist(leftBound) {
            for (let i = leftBound.x - 2; i > 0; i--) {
                for (let k = leftBound.y; k > 0; k--) {
                    if (i - 1 < 0)
                        break;

                    if (binaryField[k][i] == false || binaryField[k][i - 1] == false)
                        continue;

                    return new Point(i, k);
                }
            }
            return false;
        }

        function leftBridgeCreate(leftBound) {
            for (let i = leftBound.x - 1; i > 0; i--) {
                if (binaryField[leftBound.y][i] == true && binaryField[leftBound.y + 1][i] == true)
                    break;

                binaryField[leftBound.y][i] = true;
                binaryField[leftBound.y + 1][i] = true;
            }
        }

        function leftBridgeExist(leftBound) {
            for (let i = leftBound.x - 1; i > 0; i--) {
                if (binaryField[leftBound.y][i] == false || binaryField[leftBound.y + 1][i] == false)
                    continue;
                return true;
            }
            return false;
        }

        function leftDownBridgeCreate(leftBound, endPoint) {
            for (let i = leftBound.x - 1; i >= endPoint.x; i--) {
                binaryField[leftBound.y][i] = true;
                binaryField[leftBound.y + 1][i] = true;
            }
            for (let i = leftBound.y; i <= endPoint.y; i++) {
                binaryField[i][endPoint.x] = true;
                binaryField[i][endPoint.x - 1] = true;
            }
        }

        function leftDownBridgeExist(leftBound) {
            for (let i = leftBound.x - 2; i > 0; i--) {
                for (let k = leftBound.y; k < height - 1; k++) {
                    if (i - 1 < 0)
                        break;

                    if (binaryField[k][i] == false || binaryField[k][i - 1] == false)
                        continue;

                    return new Point(i, k);
                }
            }
            return false;
        }

        function defineConnectors() {
            // массив состоит из четырех точек: левая, правая, верхняя и нижняя границы
            // создаём список таких массивов для каждого объединения соответственно
            let resPoints = [];

            roomUnion.forEach(item => {
                let bounds = [];

                let minUpLeftX = minInArray(item, "upLeft", "x");
                let left = item.find(cur => minUpLeftX == cur.upLeft.x);

                let maxDownRightX = maxInArray(item, "downRight", "x");
                let right = item.find(cur => maxDownRightX == cur.downRight.x);

                let minUpLeftY = minInArray(item, "upLeft", "y");
                let up = item.find(cur => minUpLeftY == cur.upLeft.y);

                let maxDownRightY = maxInArray(item, "downRight", "y");
                let down = item.find(cur => maxDownRightY == cur.downRight.y);

                bounds[0] = new Point(left.upLeft.x, (left.upLeft.y + left.downRight.y) / 2);
                bounds[1] = new Point(right.downRight.x, (right.upLeft.y + right.downRight.y) / 2);
                bounds[2] = new Point((up.upLeft.x + up.downRight.x) / 2, up.upLeft.y);
                bounds[3] = new Point((down.upLeft.x + down.downRight.x) / 2, down.downRight.y);
                resPoints.push(bounds);
            });
            return resPoints;

            function minInArray(roomUnion, compared, orientation) {
                let res = Number.MAX_VALUE;
                roomUnion.forEach(item => {
                    if (item[compared][orientation] < res)
                        res = item[compared][orientation];
                });
                return res;
            }

            function maxInArray(roomUnion, compared, orientation) {
                let res = 0;
                roomUnion.forEach(item => {
                    if (item[compared][orientation] > res)
                        res = item[compared][orientation];
                });
                return res;
            }
        }

        function generateSector(locationFrom, locationTo, isCenter) {
            let roomCount = 0;

            if (!isCenter)
                roomCount = random(2, 5);
            else
                roomCount = 1;

            for (let i = 0; i < roomCount; i++) {
                let xKoef = parseInt(width / 4, 10);
                let yKoef = parseInt(height / 4, 10);
                let xKoef2 = parseInt(width / 6, 10);
                let yKoef2 = parseInt(height / 6 - 1, 10);

                // создание одной комнаты
                let upLeft = new Point(
                    random(locationFrom.x, locationTo.x - xKoef),
                    random(locationFrom.y, locationTo.y - yKoef));

                let downRight = new Point(
                    random(upLeft.x + xKoef2, upLeft.x + xKoef - 1 > locationTo.x ? locationTo.x - upLeft.x : upLeft.x + xKoef - 1),
                    random(upLeft.y + yKoef2, upLeft.y + yKoef - 2 > locationTo.y ? locationTo.y - upLeft.y : upLeft.y + yKoef - 2));

                let current = new Room(upLeft, downRight);
                fillRoomBounds.call(this, current); // заполняем границы комнаты
                сheckCollision(current); // проверяем наличие коллизий
                rooms.push(current);
            }
        }

        (function generateMaze() {
            // вся карта делится на 4 сектора + центр, каждый из которых случайно генерируется
            generateSector(new Point(1, 1), new Point(width / 2, height / 2), false); // левый верхний
            generateSector(new Point(1, height / 2), new Point(width / 2, height - 1), false); // левый нижний
            generateSector(new Point(width / 2, 1), new Point(width, height / 2), false); // правый верхний    
            generateSector(new Point(width / 2, height / 2), new Point(width, height - 1), false); // правый нижний
            generateSector(new Point(width / 4, height / 4), new Point((width / 3) * 2, (height / 3) * 2), true); // центр
            generateSingleRoomUnion(); // создаём объединение для комнат, которые не вошли ни в одно объединение (необходимо для построения мостов)
            generateBridges(); // создаём мосты между комнатами
        })();

        this.binaryField = binaryField;
    }
}