//счётчик кликов
let clickCount = 0;
//массив, заполняемый лицом картинок
let imgLink = [];
//массив для создания рандома картинок
let arrImg = ["1", "2", "3", "4", "5", "6"];
//массив, заполняемый оборотом картинок
let imgCover = [];
//первая открытая карта
let firstPic = "";
//вторая открытая картинка
let secondPic = "";
// начальное состояние игры
let gameStart = false;
//функция создания игрового поля и карт
function createGame() {
    //если количество строк равно 3 или 9 и количество колонок равно 9, то убираем одну колонну
    if ((document.enterRowColumn.row.value == 1 && document.enterRowColumn.column.value == 9) || (document.enterRowColumn.row.value == 3 && document.enterRowColumn.column.value == 9)) {
        document.enterRowColumn.column.value--;
    }
    //если количество карт на поле получается нечетное количество, то добавляем одну колонну
    if ((document.enterRowColumn.row.value * document.enterRowColumn.column.value) % 2 != 0) {
        document.enterRowColumn.column.value++;
    }

    let arrJ = [];
    let arrJcover = [];
    //создаем переменные для игрового поля, текста поздравления с победой и кнопки начать(закончить) игру
    let gameDiv = document.getElementById("mainGameDivId");
    let textEndGame = document.getElementById("textEndGame");
    let coverButton = document.getElementById("coverButton");
    //если текст уже есть, то при новом формировании, он удалится
    if (textEndGame !== null) {
        textEndGame.remove();
    }
    //если кнопка начать(закончить) игру уже есть, то при новом формировании, она удалится
    if (coverButton !== null) {
        coverButton.remove();
    }
    //если игровое поле уже есть, то при новом формировании, оно удалится
    if (gameDiv !== null) {
        gameDiv.remove();
    }
    //после формирования поля создаем кнопку начать игру
    $(".buttonDiv").append("<button id='coverButton' onclick='coverTurn()'>Начать игру</button>");
    //после формирования поля отключаем селекты
    document.getElementById("selectRow").setAttribute("disabled", "disabled");
    document.getElementById("selectColumn").setAttribute("disabled", "disabled");
    //создаем див игрового поля
    gameDiv = document.createElement("div");
    gameDiv.id = "mainGameDivId";
    document.body.append(gameDiv);
    //создаем указанное количество строк с картами
    for (i = 0; i < document.enterRowColumn.row.value; i++) {
        let rowDiv = document.createElement("div");
        rowDiv.className = "cardStroke";
        gameDiv.append(rowDiv);
        //заполняем дивы-строки изображениями согласно введенному количеству колонн. изображениям задаем некликабельный класс
        for (j = 0; j < document.enterRowColumn.column.value; j++) {
            img = document.createElement("img");
            img.id = i + "," + j;
            img.className = "imgCardDuplicate";
            rowDiv.append(img);
        }
    }
    //цикл рандомно присваивает изображениям путь к файлу изображения и заполняет массивы imgLink и imgCover
    let gameStart = false;
    while (!gameStart) {
        imgLink = [];
        imgCover = [];
        for (i = 0; i < document.enterRowColumn.row.value; i++) {
            imgLink.push();
            imgCover.push();
            arrJ = [];
            arrJcover = [];
            for (j = 0; j < document.enterRowColumn.column.value; j++) {
                img = document.getElementById(i + "," + j);
                arrJ.push("img/" + arrImg[parseInt(Math.random() * arrImg.length)] + ".jpg");
                arrJcover.push("img/cover.jpg");
                img.src = arrJ[j];
            }
            imgLink.push(arrJ);
            imgCover.push(arrJcover);
        }
        //запускаем проверку четности картинок
        gameStart = checkArrImg();
    }
} //function createGame()

// функция проверяющая количество отдельных видов картинок на четность
function checkArrImg() {
    let arrCheckImg = [];
    for (i = 0; i < arrImg.length; i++) {
        arrCheckImg.push(0);
    }
    for (i = 0; i < imgLink.length; i++) {
        for (j = 0; j < imgLink[i].length; j++) {
            arrCheckImg[imgLink[i][j].slice(4, imgLink[i][j].indexOf(".")) - 1]++;
        }
    }
    for (i = 0; i < arrCheckImg.length; i++) {
        if (arrCheckImg[i] % 2 != 0) {
            return false;
        }
    }
    return true;
} //function checkArrImg()

//функция начала игры
function coverTurn() {
    if (!gameStart) {
        //при нажатии начать игру изображения поворачиваем оборотом
        for (i = 0; i < document.enterRowColumn.row.value; i++) {
            for (j = 0; j < document.enterRowColumn.column.value; j++) {
                let img = document.getElementById(i + "," + j);
                img.setAttribute("src", "img/cover.jpg");
            }
        }
        //при нажатии начать игру запускаем процесс присваивания атрибута пути к файлу лица картинки, запускаем функцию, делающую картинки кликабельными, меняем надпись начать игру на закончить игру, удаляем кнопку сформировать
        process();
        gameStart = true;
        classUnDuplicate();
        document.getElementById("coverButton").innerHTML = "Закончить игру";
        document.getElementById("startButton").remove();
    }
    else {
        for (i = 0; i < document.enterRowColumn.row.value; i++) {
            for (j = 0; j < document.enterRowColumn.column.value; j++) {
                let img = document.getElementById(i + "," + j);
                img.setAttribute("src", imgLink[i][j]);
            }
        }
        //если игра закончилась удаляем кнопку закончить(начать) игру, создаем кнопку сформировать, изображения делаем не кликабельными, активируем селекты выбора рядов и колонн
        gameStart = false;
        document.getElementById("coverButton").remove();
        $(".buttonDiv").append("<button id='startButton' onclick='createGame()'>Сформировать</button>");
        classDuplicate();
        document.getElementById("selectRow").removeAttribute("disabled");
        document.getElementById("selectColumn").removeAttribute("disabled");
    }

} //function coverTurn()

//действия по клику на карту
$("body").on("click", ".imgCard", function () {
    //текущей картинке присваиваем атрибут пути к файлу, сохраненный в массиве. запускаем счетчик кликов
    let id = $(this).attr("id");
    let img = document.getElementById(id);
    img.setAttribute("src", imgLink[id[0]][id[2]]);
    clickCount++;
    //один клик - записываем айди первой карты
    if (clickCount == 1) {
        firstPic = id;
    }
    //два клика - записываем айди второй карты
    if (clickCount == 2) {
        secondPic = id;
        //если у открытых картинок путь к файлу равен, а их айди разные (чтобы это не была одна карта), то оборотной стороне присваиваем значение лица, меняем класс картинки на прозрачный фон, картинка становится некликабельной, обнуляем счетчик кликов, обнуляем значения айди первой и второй карты, запускаем процесс присваивания атрибута
        if (imgLink[firstPic[0]][firstPic[2]] == imgLink[secondPic[0]][secondPic[2]] && (firstPic != secondPic)) {
            imgCover[firstPic[0]][firstPic[2]] = imgLink[firstPic[0]][firstPic[2]];
            imgCover[secondPic[0]][secondPic[2]] = imgLink[secondPic[0]][secondPic[2]];
            img = document.getElementById(firstPic);
            img.setAttribute("class", "openCard");
            img = document.getElementById(secondPic);
            img.setAttribute("class", "openCard");
            clickCount = 0;
            firstPic = "";
            secondPic = "";
            process();
            //если функция проверки завершения игры возвращает true, то создаем параграф текста с поздравлением с победой, меняем значение игры, удаляем кнопку закончить(начать) игру, создаем кнопку сформировать, активируем селекты выбора рядов и колонн
            if (checkEndGame()) {
                $(".gameControl").append("<p id='textEndGame'>Поздравлем!!!<br>Вы выиграли!!!</p>");
                gameStart = false;
                document.getElementById("coverButton").remove();
                $(".buttonDiv").append("<button id='startButton' onclick='createGame()'>Сформировать</button>");

                document.getElementById("selectRow").removeAttribute("disabled");
                document.getElementById("selectColumn").removeAttribute("disabled");
            }
        }
        //иначе запускаем функцию переворота карт обратно с временной задержкой
        else {
            setTimeout(hideCard, 1000);
        }
    }
    //по клику три - обнуляем счетчик, сбрасываем записанные айди, запускаем функцию переворота карт
    if (clickCount == 3) {
        clickCount = 0;
        firstPic = "";
        secondPic = "";
        process();
    }

}) //$("body").on("click", ".imgCard", function ()

//функция переворота карт рубашкой
function process() {
    for (i = 0; i < document.enterRowColumn.row.value; i++) {
        for (j = 0; j < document.enterRowColumn.column.value; j++) {
            document.getElementById(i + "," + j).setAttribute("src", imgCover[i][j]);
        }
    }
} //function process()

//функция идентичная функции process, но для нее выставлена временная задержка, а также при срабатывании этой функции с задержкой обнуляется счетчик кликов и сбрасываются значения открытых карт
function hideCard() {
    for (i = 0; i < document.enterRowColumn.row.value; i++) {
        for (j = 0; j < document.enterRowColumn.column.value; j++) {
            clickCount = 0;
            firstPic = "";
            secondPic = "";
            document.getElementById(i + "," + j).setAttribute("src", imgCover[i][j]);

        }
    }
} //function hideCard()

//функция проверяет завершенность игры, если в массиве imgCover не остается карт с путем к файлу рубашке, то функция возвращает true
function checkEndGame() {
    for (i = 0; i < imgCover.length; i++) {
        for (j = 0; j < imgCover[i].length; j++) {
            if (imgCover[i][j] == "img/cover.jpg") {
                return false;
            }
        }
    }
    return true;
} //function checkEndGame()

//функция присваивает изображениям кликабельный класс
function classUnDuplicate() {
    for (i = 0; i < document.enterRowColumn.row.value; i++) {
        for (j = 0; j < document.enterRowColumn.column.value; j++) {
            document.getElementById(i + "," + j).setAttribute("class", "imgCard");
        }
    }
} //function classUnDuplicate()

//функция присваивает изображениям некликабельный класс
function classDuplicate() {
    for (i = 0; i < document.enterRowColumn.row.value; i++) {
        for (j = 0; j < document.enterRowColumn.column.value; j++) {
            document.getElementById(i + "," + j).setAttribute("class", "imgCardDuplicate");
        }
    }
} //function classDuplicate()