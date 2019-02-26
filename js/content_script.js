function getTextNodeClone() {
    var content1 = window.getSelection().getRangeAt(0).cloneContents();
    var treeWalker1 = document.createTreeWalker(content1, NodeFilter.SHOW_TEXT, null, false);
    var text1 = [];
    while (treeWalker1.nextNode()) {
        if (treeWalker1.currentNode.data.includes("\n") ||
            treeWalker1.currentNode.length === 0 ||
            treeWalker1.currentNode.data === " ") {
            continue
        }

        text1.push(treeWalker1.currentNode);

    }

    return text1;
}

function getTextNodeCommon(len) {
    var content = window.getSelection().getRangeAt(0).commonAncestorContainer;
    var treeWalker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null, false);
    var text = [];
    while (treeWalker.nextNode()) {
        if (treeWalker.currentNode.data.includes("\n") ||
            treeWalker.currentNode.length === 0 ||
            treeWalker.currentNode.data === " ") {
            continue;
        }
        text.push(treeWalker.currentNode);
    }
    if (text.length === 0) {
        text.push(treeWalker.currentNode);
    }

    if (len + 1 === text.length) {
        text.splice(0, 1);
    } else {
        text.splice(len);

    }
    return text;

}

function highlightSelection() {

    reloadSettings(function () {
        var selectsClone = getTextNodeClone();
        var selectsCommon = getTextNodeCommon(selectsClone.length);
        var elementCommon;
        var elementClone;
        var indexForSplit;
        var startIndex, innerHTML;

        for (var i = 0; i < selectsCommon.length; i++) {
            elementCommon = selectsCommon[i];
            elementClone = selectsClone[i];

            indexForSplit = elementCommon.data.indexOf(elementClone.data);
            startIndex = elementCommon.parentElement.innerHTML.indexOf(elementCommon.data);
            innerHTML = elementCommon.parentElement.innerHTML.substring(startIndex, elementClone.length);
            elementCommon.parentElement.innerHTML =
                elementCommon.parentElement.innerHTML.substring(0, indexForSplit)
                + "<span style=\"background-color: " + currentColor + "\">"
                + elementCommon.parentElement.innerHTML.substring(indexForSplit, indexForSplit === 0 ? elementClone.length : elementClone.length + 1)
                + "</span>"
                + elementCommon.parentElement.innerHTML.substring(elementClone.length + indexForSplit, elementClone.length);

        }
    });
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
