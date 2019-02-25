function getTextNode(content) {
    var treeWalker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null, false);
    var containerNodSelects = [];
    while (treeWalker.nextNode()) {
        containerNodSelects.push(treeWalker.currentNode);
    }
    return containerNodSelects;
}

function highlightSelection() {

    reloadSettings(function () {
        var content = window.getSelection().getRangeAt(0).startContainer;

        var containerNodSelects = getTextNode(content);
        var selectRange;
        for (var startNode = 0; startNode < containerNodSelects.length; startNode++) {
            // if (containerNodeSafe[startNode].endOffset === 0){
            var node = addNewNodeToSelectRange(containerNodSelects[startNode]);
            selectRange = containerNodSelects[startNode];
            selectRange.parentNode.replaceChild(node, selectRange);
            // selectRange.insertNode(node);
            // }
        }
    });
}


function addNewNodeToSelectRange(range) {

    var newNodeWithBackgroundColor = document.createElement("span");
    newNodeWithBackgroundColor.style.backgroundColor = currentColor;
    newNodeWithBackgroundColor.style.color = "black";

    newNodeWithBackgroundColor.appendChild(range.cloneNode(true));

    return newNodeWithBackgroundColor;
}

function callHighlightSelection(event) {
    if (event.key === currentShortcut) {
        highlightSelection(event);
    }
}

document.addEventListener("keydown", callHighlightSelection);

//Default settings. Initialize storage to these values.
var currentColor = '#ffff00';
var currentShortcut = 'h';

/*
On startup, check whether we have stored settings.
If we don't, then store the default settings.
*/
reloadSettings(null);

function reloadSettings(callback) {

    //get one or more items from the storage area.
    browser.storage.sync.get().then(
        function (settings) {

            if (settings.color !== undefined) {
                currentColor = settings.color;
            }

            if (settings.shortcut !== undefined) {
                currentShortcut = settings.shortcut;
            }

            if (callback !== null) {
                callback();
            }
        },

        function (error) {
            console.log(error);
        });
}
