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
const howManyElements = document.querySelectorAll("li")
const newGameButton = document.getElementById("new-game")
const minMovesNeed = document.getElementById("min-moves-count")
let time;


let hanoiElements = 3;
let moves = 0
let timerIsOff = true

let minutes = 0
let seconds = 0
let houres = 0

let totalMovesNeeds = Math.pow(2, hanoiElements) - 1;

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

    // if (blockRight.childNodes.length === hanoiElements) {
    console.log("wygrałeś");
    clearInterval(timerPlay)
    if (moves > totalMovesNeeds) {
        extraText.innerHTML = "Bardzo dobrze, ale mółbyś to zrobić w " + totalMovesNeeds + " ruchach"
    } else {
        extraText.innerHTML = "Nie da się ułożyć " + hanoiElements + " elementów w mniejszej ilości ruchów."
    }
    winnerBox.style.display = "block"
    totalMoves.innerHTML = moves
    totalTime.innerHTML = time
    // }
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
    Array.from(blocks).forEach(function (element) {
        while (element.firstChild) {
            element.firstChild.remove()
        }
    })
    if (!timerIsOff) {
        clearInterval(timerPlay)
        timerIsOff = true
        minutes = 0
        seconds = 0
        houres = 0
        refresh()
    }
    moves = 0
    movesCounter.innerHTML = moves
    generateHanoiElements()
    setDraggable(blockLeft)
    totalMovesNeeds = Math.pow(2, hanoiElements) - 1;
    minMovesNeed.innerHTML = totalMovesNeeds
    console.log(totalMovesNeeds);
}

newGameButton.addEventListener("click", function () {
    moves = 0
    movesCounter.innerHTML = moves
    newGame()
    winnerBox.style.display = "none"
})

