function highlightSelection(event) {
    const userSelection = window.getSelection();

    for (let highlightNumber = 0; highlightNumber < userSelection.rangeCount; highlightNumber++) {
        const node = highlightRange(userSelection.getRangeAt(highlightNumber));
        const range = userSelection.getRangeAt(highlightNumber);
        range.deleteContents();
        range.insertNode(node);
    }
}

let defaultColor;

function highlightRange(range) {
    const newNode = document.createElement("span");
    const p = document.querySelector("p");
    newNode.setAttribute(
        "style",
        "background-color:" + defaultColor + ";"
    );

    newNode.appendChild(range.cloneContents());
    return newNode;
}

let defaultShortcut;

function callHighlightSelection(event) {
    if (event.key === defaultShortcut) {
        highlightSelection(event);
    }
}

document.addEventListener("keydown", callHighlightSelection);

let colorWell;
defaultColor = '#ffff00';
defaultShortcut = 'h';

window.addEventListener("load", startup, false);

function startup() {
    colorWell = document.querySelectorAll("td");
    colorWell.addEventListener("click", updateFirst, false);
    colorWell.addEventListener("change", updateFirst, false);
    if (localStorage.color === undefined) {
        defaultColor = '#ffff00';
    } else {
        defaultColor = localStorage.color;
    }
    if (localStorage.shortcut === undefined) {
        defaultShortcut = 'h';
    } else {
        defaultShortcut = localStorage.shortcut;
    }
}

function updateFirst(event) {
    var p = document.querySelector("td");

    if (p) {
        defaultColor = event.target.value;
    }
}