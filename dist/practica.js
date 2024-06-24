"use strict";
let herosHabilities = [
    { name: "hulk", force: "80%", velocity: "40%", stroke: "80%" },
    { name: "ironman", force: "60%", velocity: "70%", stroke: "70%" },
    { name: "thor", force: "80%", velocity: "70%", stroke: "65%" },
];
let heros = document.getElementsByClassName("heroImg");
let buttons = document.getElementsByTagName("button");
let powerBars = document.getElementsByClassName("progress-value");
let buttonBuyHabilities = document.getElementsByClassName("upgradePrices");
let totalCoins = document.getElementsByClassName("numberOfCoins");
let id = 0;
if (heros instanceof HTMLCollection &&
    buttons instanceof HTMLCollection &&
    powerBars instanceof HTMLCollection &&
    buttonBuyHabilities instanceof HTMLCollection) {
    let heroImg = [heros[0], heros[1], heros[2]];
    let buttonBack = buttons[0];
    let buttonNext = buttons[1];
    let typesOfhabilities = [
        powerBars[0],
        powerBars[1],
        powerBars[2],
    ];
    let upgradeForce = buttonBuyHabilities[0];
    let upgradeVelocity = buttonBuyHabilities[1];
    let upgradeStroke = buttonBuyHabilities[2];
    upgradeForce.addEventListener("click", () => buyHabilities(upgradeForce, typesOfhabilities));
    upgradeVelocity.addEventListener("click", () => buyHabilities(upgradeVelocity, typesOfhabilities));
    upgradeStroke.addEventListener("click", () => buyHabilities(upgradeStroke, typesOfhabilities));
    buttonNext.addEventListener("click", () => changeNextImg(heroImg, typesOfhabilities));
    buttonBack.addEventListener("click", () => changeBackImg(heroImg, typesOfhabilities));
}
/*Funcion que cambia la imagen al hacer click, con id controlamos el numero de imagenes(son 3),
  una vez llegada a la ultima restablecemos en 0 */
function changeNextImg(heroes, typesOfhabilities) {
    if (id < 2) {
        heroes[id].style.display = "none";
        heroes[id + 1].style.display = "block";
        id += 1;
    }
    else if (id == 2) {
        heroes[id].style.display = "none";
        heroes[0].style.display = "block";
        id = 0;
    }
    changeInfo(heroes[id].dataset.name, typesOfhabilities);
}
//Cumple la misma funcion que changeNextImg(),pero a la inversa.
function changeBackImg(heroes, typesOfhabilities) {
    if (id > 0) {
        heroes[id].style.display = "none";
        heroes[id - 1].style.display = "block";
        id = id - 1;
    }
    else if (id == 0) {
        heroes[id].style.display = "none";
        heroes[2].style.display = "block";
        id = 2;
    }
    changeInfo(heroes[id].dataset.name, typesOfhabilities);
}
/* Funcion que cambia el valor del nombre mostrado, se le pasa por parametro el nombre del siguiente heroe al cambiar la imagen con las
funciones de cambio de imagen, se saca el nombre de un data-name en la img */
function changeInfo(heroesName, typesOfhabilities) {
    let nameOfHero = document.getElementsByClassName("nameOfHero");
    let valor = herosHabilities.filter((value) => value.name === heroesName); //
    typesOfhabilities.map((value) => {
        if (value.dataset.name === "velocity") {
            value.style.width = valor[0].velocity;
        }
        else if (value.dataset.name === "force") {
            value.style.width = valor[0].force;
        }
        else if (value.dataset.name === "stroke") {
            value.style.width = valor[0].stroke;
        }
    });
    if (nameOfHero instanceof HTMLCollection) {
        nameOfHero[0].innerHTML = heroesName;
    }
}
/* Funcion para mejorar las habilidades */
function buyHabilities(divOfHabilities, typesOfhabilities) {
    let totalCoinsValue = Number(totalCoins[0].dataset.totalcoins);
    const dataPriceAttr = divOfHabilities.getAttribute("data-habilities"); //Json guardado en una data-habilities con los precios , porcentaje de subida de habilidad y tipo de habilidad
    if (dataPriceAttr) {
        try {
            var dataPriceObj = JSON.parse(dataPriceAttr);
            typesOfhabilities.forEach((value) => {
                let valueOfBars = Number(value.style.width.replace(/\s*%/, ""));
                if (dataPriceObj.habilitie === value.dataset.name && //se comprueba que la habilidad comprada sea igual a la habilidad en el array para cambiar su valor
                    totalCoinsValue >= dataPriceObj.price //se comprueba que el dinero disponible  es mayor al precio de la mejora
                ) {
                    var sumOfValue = Number(value.style.width.replace(/\s*%/, "")) +
                        Number(dataPriceObj.plus);
                    sumOfValue > 100
                        ? (value.style.width = "100%")
                        : (value.style.width = sumOfValue.toString() + "%"); //si la suma de la mejora de la habilidad es mayor a 100 , se queda en 100 , sino se queda en la suma indicada
                    updateInfoHero(dataPriceObj.habilitie, value.style.width); //actualizacion con las mejoras hechas
                    collectAndUpdateCoins(totalCoins, dataPriceObj, valueOfBars); //actualizacion de monedas
                }
                else if (totalCoinsValue < dataPriceObj.price) {
                    openAlert();
                }
            });
            // Accedes a la propiedad price del objeto parsed
        }
        catch (error) {
            console.error("Error al parsear JSON:", error);
        }
    }
    else {
        console.log("El atributo data-habilities no está presente en el elemento.");
    }
}
//Funcion que actualiza el array de objetos con los Heroes
function updateInfoHero(updateValue, valueOfBars) {
    let divHeroName = document.getElementsByClassName("nameOfHero");
    let valueInfo = updateValue;
    herosHabilities.forEach((value) => {
        if (value.name === divHeroName[0].innerHTML) {
            value[valueInfo] = valueOfBars;
        }
    });
}
/*Funcion para "pagar" el coste de la compra de habilidad, que recibe el total de monedas y el json con el precio, aumento de habilidad y la habilidad
se comprueba que la barra de habilidad sea menor que 100 y que el total de monedas sea mayor o igual
que el precio de compra */
function collectAndUpdateCoins(totalCoins, skillPrice, barValue) {
    console.log(barValue);
    let totalCoinsValue = Number(totalCoins[0].dataset.totalcoins);
    if (barValue < 100 && totalCoinsValue >= skillPrice.price) {
        totalCoins[0].dataset.totalcoins = (Number(totalCoins[0].dataset.totalcoins) - Number(skillPrice.price)).toString();
        totalCoins[0].dataset.totalcoins + " Total de monedas";
        totalCoins[0].innerHTML =
            totalCoins[0].dataset.totalcoins +
                "<img class='coinsImg' style='margin-left: 10px; width: 30%; height: 30px' src='../src/img/pngegg (22).png'/>";
    }
}
let buttonClose = document.getElementsByClassName("closeDiv");
function closeAlert() {
    let alertDiv = document.getElementsByClassName("insufficientCoins");
    let blurBackground = document.getElementsByClassName("blur-background");
    ;
    buttonClose[0].addEventListener("click", () => {
        alertDiv[0].style.display = "none";
        blurBackground[0].style.display = "none";
    });
}
function openAlert() {
    let alertDiv = document.getElementsByClassName("insufficientCoins");
    alertDiv[0].style.display = "flex";
    let blurBackground = document.getElementsByClassName("blur-background");
    ;
    blurBackground[0].style.display = "block";
}
closeAlert();
