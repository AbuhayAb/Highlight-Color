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
    newNode.setAttribute(
       "style",
       "background-color: yellow;"
    );	

    newNode.appendChild(range.cloneContents());
    return newNode;
}

function callhighligtSelection(event) {
	 if (event.key.toUpperCase() == 'H') {
	    highligtSelection(event);
	  }
}

document.addEventListener("keydown", callhighligtSelection);	
