var view = {
    displayMessage: function (msg) {
        var messageArea = document.getElementById("messageArea"); // Форма ввода данных пользователем
        messageArea.innerHTML = msg;
    }
    , displayHit: function (location) {
        var cell = document.getElementById(location); // Оповещение попадания на игровом поле
        cell.setAttribute("class", "hit");
    }
    , displayMiss: function (location) {
        var cell = document.getElementById(location); // Оповещение промаха
        cell.setAttribute("class", "miss");
    }
};
var model = {
    boardSize: 7 // Размер сетки игрового поля
        
    , numShips: 3 // Количество кораблей в игре
        
    , shipLength: 3 // Длина каждого корабля
        
    , shipsSunk: 0 // Количество потопленных кораблей
        
    , ships: [{
            locations: [0, 0, 0]
            , hits: ["", "", ""]
        }
        , {
            locations: [0, 0, 0]
            , hits: ["", "", ""]
        }
        , {
            locations: [0, 0, 0]
            , hits: ["", "", ""]
        }], // Позиции кораблей и коодринаты попаданий
    fire: function (guess) {
        for (var i = 0; i < this.numShips; i++) { // Перебираем все корабли
            var ship = this.ships[i]; // Получаем объект ship
            var locations = ship.locations;
            var index = locations.indexOf(guess); // Эти две строчки можно объеденить : var index = shop.locations.indexOf(guess).
            if (index >= 0) {
                ship.hits[index] = "hit"; // По тому же индексу ставим значение "hit" в массив
                view.displayHit(guess);
                view.displayMessage("HIT!");
                if (this.isSunk(ship)) { // Если корабль потоплен, увеличиваем shipsSunk на еденицу
                    view.displayMessage("Корабль потоплен!");
                    this.shipsSunk++;
                }
                return true; // Так как мы попали - возвращаем тру
            }
        }
        view.displayMiss(guess);
        view.displayMessage("Мимо!");
        return false; // В противном случае false
    }
    , isSunk: function (ship) { // Проверка потоплен ли корабль
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") { // Если 
                return false
            }
        }
        return true;
    }
    , generateShipLocations: function () { // Создаем корабли
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    }
    , generateShip: function () { // Генерируем положение кораблей ( вертикаль или горизонталь)
        var direction = Math.floor(Math.random() * 2);
        var row, col;
        if (direction === 1) { // Если 1 то создаем каорабль по горизонтали
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }
        else { // Иначе по вертикали
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }
        var newShipLocations = []; // Заносим полученные значения в массив координат кораблей в зависимости какого он вида
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            }
            else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    }
    , collision: function (locations) { // Прверяем чтобы корабли не накладывались друг на друга
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true
                }
            }
        }
        return false;
    }
};
var controller = {
    guesses: 0
    , processGuess: function (guess) {
        var location = parseGuess(guess);
        if (location) { // null - псевдоложное значение
            this.guesses++; // Добавляем к счетчику
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) { // Если попали и количество потопланных кораблей равен общему количеству на доске - победа
                view.displayMessage("Вы потопили все наши корабли за " + this.guesses + " выстрелов")
            }
        }
    }
};

function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"]; // Создаем массив со всеми вариантами первого значения
    if (guess === null || guess.length !== 2) { // Проверяем на null и что в строке два символа
        alert("Проверьте пожалуйста введенные значения");
    }
    else {
        firstChar = guess.charAt(0); // Извлекаем первый символ
        var row = alphabet.indexOf(firstChar); // Получаем цифру соотвествующуй букве
        var column = guess.charAt(1); // Извлекаем второй символ
        if (isNaN(row) || isNaN(column)) { // Проверяем строки с толбы не явлюящиеся цифрами 
            alert("Такой клетке в нашем поле нет");
        }
        else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) { // Чекаем что цифры в диапазоне от 0 до 6
            alert("Это значение где то за нешим полем");
        }
        else {
            return row + column; // После всех проверок получаем результат
        }
    }
    return null; // Проверка не пройдена, возращаем null
};

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton; // При нажатии на Fire! вызываем функцию
    model.generateShipLocations();
};

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
};
window.onload = init;
/*console.log(parseGuess("A0"));
console.log(parseGuess("B6"));
console.log(parseGuess("G3"));
console.log(parseGuess("H0"));
console.log(parseGuess("A7"));*/
/*controller.processGuess("A0");
controller.processGuess("A6");
controller.processGuess("B6");
controller.processGuess("C6");
controller.processGuess("C4");
controller.processGuess("D4");
controller.processGuess("E4");
controller.processGuess("B0");
controller.processGuess("B1");
controller.processGuess("B2");*/