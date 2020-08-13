const blockLeft = document.getElementById("block-left")
const blockRight = document.getElementById("block-right")
const blocks = document.getElementsByClassName("block")
const hanoiElementsBlock = document.getElementsByClassName("hanoi-element")
let hanoiElements = 6;

generateHanoiElements()
window.addEventListener('DOMContentLoaded', () => {
    setDraggable(blockLeft)
})

function dragstart_handler(ev) {
    // Add the target element's id to the data transfer object
    ev.dataTransfer.setData("text/plain", ev.target.id);
    ev.dataTransfer.dropEffect = "copy";
    //    ev.dataTransfer.setData("text/plain", ev.target.data)
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
   console.log(isParent);
    // console.log(target);
    // console.log(draggedElement);

    if (target.length === 0 && isParent) {
        const data = ev.dataTransfer.getData("text/plain");
        ev.target.appendChild(document.getElementById(data));
        setDraggable(blocks)
    } else {
            lastOrder = target[target.length - 1].getAttribute("data-order")
            actualOrder = draggedElement.dataset.order
            console.log(lastOrder);
            console.log(actualOrder);
        if ((actualOrder > lastOrder || lastOrder === undefined) && isParent) {
            const data = ev.dataTransfer.getData("text/plain");
            ev.target.appendChild(document.getElementById(data));
            lastorder = null;
            actualOrder = null
            setDraggable(blocks)
            console.log(lastOrder);
            console.log(actualOrder);
            
        }
    }




}


function generateHanoiElements() {
    width = 100;

    for (let i = 0; i < hanoiElements; i++) {
        let smaller = width / hanoiElements
        width = width - smaller
        let color = "#" + ((1 << 24) * Math.random() | 0).toString(16)
        width
        let elementHanoi = document.createElement('div')
        elementHanoi.setAttribute("id", "hanoi-element-" + i)
        elementHanoi.setAttribute("class", "hanoi-element")
        elementHanoi.setAttribute("data-order", i)
        elementHanoi.style.backgroundColor = color
        elementHanoi.style.width = width + "%"
        blockLeft.appendChild(elementHanoi)
    }



    //   if (blockLeft.hasChildNodes()){
    //    let children = blockLeft.children
    //    children[hanoiElements-1].setAttribute("draggable", true)
    //  }
}

function setDraggable(element) {
    Array.from(blocks).forEach(function (element) {
        let children = element.children
        if (element.childNodes.length > 0) {
            Array.from(children).forEach((element => {
                element.setAttribute("draggable", false)
            }))
            children[children.length - 1].setAttribute("draggable", true)
            children[children.length - 1].addEventListener("dragstart", dragstart_handler)
        }
    })
}
