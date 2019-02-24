function highlightSelection() {

    reloadSettings(function () {
        var selectionObj = window.getSelection();
        var selectRange;
        for (var indexSelect = 0; indexSelect < selectionObj.rangeCount; indexSelect++) {
            var node = addNewNodeToSelectRange(selectionObj.getRangeAt(indexSelect));
            selectRange = selectionObj.getRangeAt(indexSelect);
            selectRange.deleteContents();
            selectRange.insertNode(node);
        }
    });
}


function addNewNodeToSelectRange(range) {

    var newNodeWithBackgroundColor = document.createElement("span");
    newNodeWithBackgroundColor.setAttribute(
        "style",
        "background-color:" + currentColor +
        ";position: relative;"
    );

    newNodeWithBackgroundColor.appendChild(range.cloneContents());

    return newNodeWithBackgroundColor;
}

function callHighlightSelection(event) {
    if (event.key === currentShortcut) {
        highlightSelection(event);
    }
}

document.addEventListener("keydown", callHighlightSelection);

var currentColor = '#ffff00';
var currentShortcut = 'h';

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
