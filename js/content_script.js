function highligtSelection(event) {
    var userSelection = window.getSelection();

    for(var highligtNumber = 0; highligtNumber < userSelection.rangeCount; highligtNumber++) {
        var node = highlightRange(userSelection.getRangeAt(highligtNumber));
        var range = userSelection.getRangeAt(highligtNumber);
        range.deleteContents();
        range.insertNode(node);
    }
}

function highlightRange(range) {
    var newNode = document.createElement("span");
    var p = document.querySelector("p");
    newNode.setAttribute(
       "style",
       "background-color:"+ defaultColor +";"
    );	

    newNode.appendChild(range.cloneContents());
    return newNode;
}

function callhighligtSelection(event) {
	 if (event.key == defaultShortcut) {
	    highligtSelection(event);
	  }
}

document.addEventListener("keydown", callhighligtSelection);

var colorWell;
var defaultColor = '#ffff00';
var defaultShortcut = 'h';

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

