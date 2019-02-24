/*
    source: https://stackoverflow.com/questions/304837/javascript-user-selection-highlighting
 */

function getSafeRanges(dangerous) {
    var commonAncestorContainer = dangerous.commonAncestorContainer;
    // Starts -- Work in ward from the start, selecting the largest safe range
    var containerSelectedFromStart = new Array(0);
    var rangesSafe = new Array(0);

    for (var container = dangerous.startContainer;
         container !== commonAncestorContainer; container = container.parentNode) {
        containerSelectedFromStart.push(container);
    }

    var newRange;
    for (var i = 0; i < containerSelectedFromStart.length; i++) {
        newRange = document.createRange();
        if (i) {
            newRange.setStartAfter(containerSelectedFromStart[i - 1]);
            newRange.setEndAfter(containerSelectedFromStart[i].lastChild);
        }
        else {
            newRange.setStart(containerSelectedFromStart[i], dangerous.startOffset);
            newRange.setEndAfter(
                (containerSelectedFromStart[i].nodeType === Node.TEXT_NODE) ?
                    containerSelectedFromStart[i] : containerSelectedFromStart[i].lastChild);
        }
        rangesSafe.push(newRange);
    }


    // Ends -- basically the same code reversed
    var containerSelectedFromEnd = new Array(0);
    var rangesSafeEnd = new Array(0);

    for (var container = dangerous.endContainer;
         container !== commonAncestorContainer; container = container.parentNode) {
        containerSelectedFromEnd.push(container);
    }

    for (var index = 0; index < containerSelectedFromEnd.length; index++) {
        newRange = document.createRange();
        if (index) {
            newRange.setStartBefore(containerSelectedFromEnd[index].firstChild);
            newRange.setEndBefore(containerSelectedFromEnd[index - 1]);
        }
        else {
            newRange.setStartBefore(
                (containerSelectedFromEnd[index].nodeType === Node.TEXT_NODE)
                    ? containerSelectedFromEnd[index] : containerSelectedFromEnd[index].firstChild
            );
            newRange.setEnd(containerSelectedFromEnd[index], dangerous.endOffset);
        }
        rangesSafeEnd.unshift(newRange);
    }

    // Middle -- the unCaptured middle
    if (!containerSelectedFromStart.length || !containerSelectedFromEnd.length) {
        return [dangerous];
    }


    newRange = document.createRange();
    newRange.setStartAfter(containerSelectedFromStart[containerSelectedFromStart.length - 1]);
    newRange.setEndBefore(containerSelectedFromEnd[containerSelectedFromEnd.length - 1]);


    // Concat
    rangesSafe.push(newRange);
    response = rangesSafe.concat(rangesSafeEnd);

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
