const blockLeft = document.getElementById("block-left")
const blockRight = document.getElementById("block-right")
const blockMiddle = document.getElementById("block-middle")
const blocks = document.getElementsByClassName("block")
const hanoiElementsBlock = document.getElementsByClassName("hanoi-element")
const movesCounter = document.getElementById("moves-count")
const totalMoves = document.getElementById("total-moves")
const totalTime = document.getElementById("total-time")
const winnerBox = document.querySelector(".winner-box")
const extraText = document.getElementById("additional-text")
const howManyElements = document.getElementsByClassName("user-choice-number")
const newGameButton = document.getElementById("new-game")
const minMovesNeed = document.getElementById("min-moves-count")
const gameRules = document.getElementById("game-rules")
const gameRulesButton = document.getElementById("game-rules-button")
const gameInstruction = document.getElementById("instruction")
const gameContainer = document.getElementById("game-container")
const newGameBox = document.getElementById("new-game-box")
const leftButton = document.getElementById("left-button")
const rightButton = document.getElementById("right-button")
const userChoice = document.getElementById("user-choice")
const userNameWinMessage = document.querySelector(".winner-meesage-user-name")
const userResultList = document.querySelector(".user-result--list")
const userData = document.getElementById("user-data")
const settingsIcon = document.getElementById("setting")
const userResultBox = document.querySelector(".user-game-stats")
const closeBox = document.querySelector(".close-box")
const resultMessage = document.querySelector(".result-message")
const userName = document.querySelector(".user-name")
const settingBox = document.querySelector(".settings-box")
const closeSettings = document.querySelector(".close-settings")
const settingForm = document.getElementById("setting-form")

console.log(userName);

let time;
let hanoiElements = 3;
let moves = 0
let timerIsOff = true
let gameRulesModalIsOpen = true
let gameHistoryModalIsOpen = false
let gameSettingModalIsOpen = false
let minutes = 0
let seconds = 0
let houres = 0
let totalMovesNeeds = Math.pow(2, hanoiElements) - 1;
let gameRulesOn = true
let userNamePrompt

let newScore = {
    userName: "",
    userGameTime: "",
    userTotalMove: "",
    elementsToMove: ""
}

function getUserName() {
    if (localStorage.name == "" || localStorage.name == undefined || localStorage.name == null) {
        userNamePrompt = prompt("Podaj swoje imię");
        if (userNamePrompt === null || userNamePrompt === "") {
            userNamePrompt = "Nieznajomy"
            userName.innerHTML = userNamePrompt
        } else {
            localStorage.setItem("name", userNamePrompt);
            userName.innerHTML = userNamePrompt
        }
    } else {
        userNamePrompt = localStorage.name
        userName.innerHTML = userNamePrompt
    }
}

getUserName()

// wybór liczby elementów do ułożenia 
Array.from(howManyElements).forEach(function (element) {
    element.addEventListener("click", function () {
        hanoiElements = element.textContent
        newGame()
    })
})


generateHanoiElements()

window.addEventListener('DOMContentLoaded', () => {
    minMovesNeed.innerHTML = totalMovesNeeds
    setDraggable(blockLeft)
})

function dragstart_handler(ev) {
    // Add the target element's id to the data transfer object
    ev.dataTransfer.setData("text/plain", ev.target.id);
    ev.dataTransfer.dropEffect = "copy";
}


function dragover_handler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}
function drop_handler(ev) {
    ev.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    let draggedId = ev.dataTransfer.getData("text/plain")
    let draggedElement = document.getElementById(draggedId)
    let target = ev.target.childNodes;
    let lastorder = null;
    let actualOrder = null;
    let isParent = ev.target.classList.contains("block")


    if (target.length === 0 && isParent) {
        const data = ev.dataTransfer.getData("text/plain");
        ev.target.appendChild(document.getElementById(data));
        setDraggable(blocks)
        countMoves()
        if (timerIsOff) {
            timer()
        }
    } else {
        lastOrder = target[target.length - 1].getAttribute("data-order")
        actualOrder = draggedElement.dataset.order
        if ((actualOrder > lastOrder || lastOrder === undefined) && isParent) {
            const data = ev.dataTransfer.getData("text/plain");
            ev.target.appendChild(document.getElementById(data));
            lastorder = null;
            actualOrder = null
            setDraggable(blocks)
            countMoves()
            if (timerIsOff) {
                timer()
            }
            if (blockRight.childNodes.length == hanoiElements) {
                endGame()
            }
        }
    }
}


function generateHanoiElements() {
    width = 100;

    for (let i = 0; i < hanoiElements; i++) {
        let smaller = width / hanoiElements
        width = width - smaller
        let color = '#' + Math.random().toString(16).substr(-6);
        width
        let elementHanoi = document.createElement('div')
        elementHanoi.setAttribute("id", "hanoi-element-" + i)
        elementHanoi.setAttribute("class", "hanoi-element")
        elementHanoi.setAttribute("data-order", i)
        elementHanoi.style.backgroundColor = color
        elementHanoi.innerHTML = hanoiElements - i
        elementHanoi.style.width = width + "%"
        blockLeft.appendChild(elementHanoi)
    }
}

function setDraggable(element) {
    Array.from(blocks).forEach(function (element) {
        let children = element.children
        if (element.childNodes.length > 0) {
            Array.from(children).forEach((element => {
                element.setAttribute("draggable", false)
                element.style.cursor = "not-allowed";
            }))
            children[children.length - 1].setAttribute("draggable", true)
            children[children.length - 1].style.cursor = "pointer"
            children[children.length - 1].addEventListener("dragstart", dragstart_handler)
        }
    })
}

function endGame() {
    clearInterval(timerPlay)
    userNameWinMessage.innerHTML = localStorage.name;
    if (moves > totalMovesNeeds) {
        extraText.innerHTML = "Bardzo dobrze, ale mółbyś to zrobić w " + totalMovesNeeds + " ruchach"
    } else {
        extraText.innerHTML = "Nie da się ułożyć " + hanoiElements + " elementów w mniejszej ilości ruchów."
    }
    winnerBox.style.display = "block"
    totalMoves.innerHTML = moves
    totalTime.innerHTML = time
    leftButton.style.display = "none"
    rightButton.style.display = "none"
    userChoice.style.display = "none"


    newScore.userName = localStorage.name;
    newScore.userGameTime = totalTime.innerHTML;
    newScore.userTotalMove = totalMoves.innerHTML;
    newScore.elementsToMove = String(hanoiElements)

    saveScoreToLocalStorage(newScore)
}


function countMoves() {
    moves++
    movesCounter.innerHTML = moves
}

function timer() {
    timerIsOff = false
    if (!timerIsOff) {
        timerPlay = setInterval(function () {
            seconds++
            if (seconds < 10) {
                seconds = "0" + seconds
            }
            if (seconds == 60) {
                seconds = 0
                minutes++
                if (minutes == 60) {
                    minutes = 0
                    houres++
                }
            }
            refresh()
        }, 1000)
    }
}

function refresh() {
    time = minutes + ":" + seconds;
    document.getElementById("timer").innerHTML = time;
}

function newGame() {
    // czyszczenie starych elementów piramidy
    Array.from(blocks).forEach(function (element) {
        while (element.firstChild) {
            element.firstChild.remove()
        }
    })
    // zerowanie licznika czasu
    if (!timerIsOff) {
        clearInterval(timerPlay)
        timerIsOff = true
        minutes = 0
        seconds = "0" + 0
        houres = 0
        refresh()
    }
    // zerowanie licznika ruchów wykonanych przez uzytkownika
    moves = 0
    movesCounter.innerHTML = moves
    // generowanie nowych elementów piramidy
    generateHanoiElements()
    // ustawianie draggable na najwyżym lemencie bloku lewego
    setDraggable(blockLeft)
    // wyliczanie minimalnej liczby ruchów do ułożenia wiezy
    totalMovesNeeds = Math.pow(2, hanoiElements) - 1;
    minMovesNeed.innerHTML = totalMovesNeeds
    // pokazanie bloku z mozliwoscia wyboru liczby elementow
    userChoice.style.display = "flex"
}


function saveScoreToLocalStorage(newObject) {
    let dataFromLocalStorage = [];
    if (localStorage.getItem("results") != null) {
        dataFromLocalStorage = JSON.parse(localStorage.getItem("results"));
        dataFromLocalStorage.push(newObject)
        localStorage.setItem("results", JSON.stringify(dataFromLocalStorage))
    } else {
        dataFromLocalStorage.push(newObject)
        localStorage.setItem("results", JSON.stringify(dataFromLocalStorage))
    }
}


function renderAllResults() {
    let allResults = JSON.parse(localStorage.getItem("results"))
    if (allResults === null) {
        console.log("musisz zagrać żeby pojawiły się wynik");
        resultMessage.style.display = "block"
    } else {
        resultMessage.style.display = "none"
        allResults.forEach(function (singleResult) {

            if (singleResult.userName === localStorage.name) {
                resultMessage.style.display = "none"
                let markup = `
        <div class="user-result-single-record">
        <div>Gracz <span class="result-span">${singleResult.userName}</span></div>
        <div>Liczba elementów do ułożenia <span class="result-span">${singleResult.elementsToMove}</span></div>
        <div>Czas wykonania <span class="result-span">${singleResult.userGameTime}</span> </div>
        <div>Liczba ruchów <span class="result-span">${singleResult.userTotalMove}</span></div>
        </div>`;
                userResultList.insertAdjacentHTML('beforeend', markup)
            }
        })
    }
}

newGameButton.addEventListener("click", function () {
    moves = 0
    movesCounter.innerHTML = moves
    newGame()
    winnerBox.style.display = "none"
    leftButton.style.display = "block"
    rightButton.style.display = "block"
})

gameRulesButton.addEventListener("click", function () {
    gameContainer.classList.remove("supreme")
    gameRules.style.display = "none"
    leftButton.style.display = "block"
    rightButton.style.display = "block"
    gameRulesModalIsOpen = false
    timer()
})

gameInstruction.addEventListener("click", function () {
    if (!gameHistoryModalIsOpen && !gameSettingModalIsOpen) {
    gameRules.style.display = "flex";
    gameContainer.classList.add("supreme")
    leftButton.style.display = "none"
    rightButton.style.display = "none"
    gameRulesModalIsOpen = true
    clearInterval(timerPlay)
    timerIsOff = true
    }
})

newGameBox.addEventListener("click", function () {
    newGame()
})


userData.addEventListener("click", function () {
    if (!gameSettingModalIsOpen && !gameRulesModalIsOpen) {
    userResultBox.style.display = "flex"
    gameContainer.classList.add("supreme")
    leftButton.style.display = "none"
    rightButton.style.display = "none"
    renderAllResults()
    clearInterval(timerPlay)
    timerIsOff = true
    gameHistoryModalIsOpen = true
    }
})


settingsIcon.addEventListener('click', function () {
    console.log(gameHistoryModalIsOpen);
    console.log(gameRulesModalIsOpen);
    if (!gameHistoryModalIsOpen && !gameRulesModalIsOpen) {
        settingBox.style.display = "flex"
        gameContainer.classList.add("supreme")
        leftButton.style.display = "none"
        rightButton.style.display = "none"
        clearInterval(timerPlay)
        timerIsOff = true
        gameSettingModalIsOpen = true
    }

})


closeBox.addEventListener("click", function () {
    userResultBox.style.display = "none"
    userResultList.innerHTML = ""
    timer()
    gameContainer.classList.remove("supreme")
    leftButton.style.display = "block"
    rightButton.style.display = "block"
    gameHistoryModalIsOpen = false
})

closeSettings.addEventListener("click", function () {
    settingBox.style.display = "none"
    timer()
    settingForm.reset()
    gameContainer.classList.remove("supreme")
    leftButton.style.display = "block"
    rightButton.style.display = "block"
    gameSettingModalIsOpen = false
})

settingForm.addEventListener("submit", function (e) {
    e.preventDefault()
    let newUserName = document.getElementById("name")
    localStorage.name = newUserName.value
    userName.innerHTML = localStorage.name
    settingForm.reset()
    settingBox.style.display = "none"
    gameContainer.classList.remove("supreme")
    leftButton.style.display = "block"
    rightButton.style.display = "block"
    timerIsOff = false
    gameSettingModalIsOpen = false
    newGame()
})
