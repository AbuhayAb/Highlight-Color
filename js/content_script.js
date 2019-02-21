function highlightSelection() {

    reloadSettings(function() {
        var userSelection = window.getSelection();
        var range;
        for (var highlightNumber = 0; highlightNumber < userSelection.rangeCount; highlightNumber++) {
            var node = highlightRange(userSelection.getRangeAt(highlightNumber));
            range = userSelection.getRangeAt(highlightNumber);
            range.deleteContents();
            range.insertNode(node);
        }
    });
}


function highlightRange(range) {
    var newNode = document.createElement("span");
    newNode.setAttribute(
        "style",
        "background-color:" + currentColor + ";"
    );

    newNode.appendChild(range.cloneContents());
    return newNode;
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

