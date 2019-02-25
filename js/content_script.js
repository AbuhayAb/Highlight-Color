/*
    source: https://stackoverflow.com/questions/304837/javascript-user-selection-highlighting
 */

function getSafeRanges(dangerous) {
    var commonAncestorContainer = dangerous.commonAncestorContainer;
    // Starts -- Work in ward from the start, selecting the largest safe range
    var containerNodeFromStart = new Array(0);
    var containerNodeFromStartSafe = new Array(0);
    var newRange;
    // Ends -- basically the same code reversed
    var containerNodeFromEnd = new Array(0);
    var containerNodeFromEndSafe = new Array(0);

    for (var startContainer = dangerous.startContainer;
         startContainer !== commonAncestorContainer; startContainer = startContainer.parentNode) {
        containerNodeFromStart.push(startContainer);
    }


    for (var endContainer = dangerous.endContainer;
         endContainer !== commonAncestorContainer; endContainer = endContainer.parentNode) {
        containerNodeFromEnd.push(endContainer);
    }

    if (!containerNodeFromStart.length || !containerNodeFromEnd.length) {
        return [dangerous];
    }

    newRange = document.createRange();
    newRange.setStart(containerNodeFromStart[0], dangerous.startOffset);
    var isSameNodeTypeStart = containerNodeFromStart[0].nodeType === Node.TEXT_NODE;
    newRange.setEndAfter(isSameNodeTypeStart ? containerNodeFromStart[0] : containerNodeFromStart[0].lastChild);
    containerNodeFromStartSafe.push(newRange);

    for (var i = 1; i < containerNodeFromStart.length; i++) {
        newRange = document.createRange();
        newRange.setStartAfter(containerNodeFromStart[i - 1]);
        newRange.setEndAfter(containerNodeFromStart[i].lastChild);

        containerNodeFromStartSafe.push(newRange);
    }

    newRange = document.createRange();
    var isSameNodeTypeEnd = containerNodeFromEnd[0].nodeType === Node.TEXT_NODE;

    newRange.setStartBefore(isSameNodeTypeEnd ? containerNodeFromEnd[0] : containerNodeFromEnd[0].firstChild);
    newRange.setEnd(containerNodeFromEnd[0], dangerous.endOffset);
    containerNodeFromEndSafe.unshift(newRange);

    for (var index = 1; index < containerNodeFromEnd.length; index++) {
        newRange = document.createRange();

        newRange.setStartBefore(containerNodeFromEnd[index].firstChild);
        newRange.setEndBefore(containerNodeFromEnd[index - 1]);


        containerNodeFromEndSafe.unshift(newRange);
    }

    // the unCaptured middle
    newRange = document.createRange();
    newRange.setStartAfter(containerNodeFromStart[containerNodeFromStart.length - 1]);
    newRange.setEndBefore(containerNodeFromEnd[containerNodeFromEnd.length - 1]);


    // Concat
    containerNodeFromStartSafe.push(newRange);
    response = containerNodeFromStartSafe.concat(containerNodeFromEndSafe);

    // Send to Console
    return response;
}

function highlightSelection() {

    reloadSettings(function () {
        var selectionObj = window.getSelection().getRangeAt(0);
        var safeRange = getSafeRanges(selectionObj);
        var selectRange;
        for (var indexSelect = 0; indexSelect < safeRange.length; indexSelect++) {
            var node = addNewNodeToSelectRange(safeRange[indexSelect]);
            selectRange = safeRange[indexSelect];
            selectRange.deleteContents();
            selectRange.insertNode(node);
        }
    });
}

// function removehighlightSelection(nodeToRemove) {
//     // var contants = document.createTextNode(nodeToRemove.innerHTML);
//     // nodeToRemove.parentNode.replaceChild(nodeToRemove.cloneContents(), nodeToRemove);
//     console.log(nodeToRemove);
// }

function addNewNodeToSelectRange(range) {

    // console.log(range);

    var newNodeWithBackgroundColor = document.createElement("span");
    newNodeWithBackgroundColor.style = "background-color:" + currentColor + ";";
    // newNodeWithBackgroundColor.onselect ="removehighlightSelection(range);";

    newNodeWithBackgroundColor.appendChild(range.cloneContents());

    return newNodeWithBackgroundColor;
}

function callHighlightSelection(event) {
    if (event.key === currentShortcut) {
        highlightSelection(event);
    }
}

document.addEventListener("keydown", callHighlightSelection);
// document.addEventListener("onselect", removehighlightSelection);
/*
Default settings. Initialize storage to these values.
 */
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
