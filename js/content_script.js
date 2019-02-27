function getTextFromCommonAncestorNode() {
    var range = window.getSelection().getRangeAt(0);
    var treeWalker = document.createTreeWalker(
        range.commonAncestorContainer,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function (node) {
                if (range.isPointInRange(node, 0))
                    return NodeFilter.FILTER_ACCEPT;
            }
        },
        false
    );

    var node;
    var nodes = [];
    while (node = treeWalker.nextNode()) {
        if (node.data.replace(/[\s]+/, "").length) {
            nodes.push(node);
        }
    }

    // if it si only one words
    if (nodes.length === 0) {
        var startNode = range.startContainer;
        var startOffset = range.startOffset;
        var endOffset = range.endOffset;
        node = startNode.splitText(startOffset);
        node.splitText(endOffset - startOffset);
        nodes.push(node);
        return nodes;
    }

    // for last word
    if (!nodes.includes(range.endContainer)) {
        nodes.push(range.endContainer);
    }
    //for first word
    if (!nodes.includes(range.startContainer)) {
        nodes.push(range.startContainer);
    }

    return nodes;

}

function highlightSelection() {

    reloadSettings(function () {
        var selectsTextNode = getTextFromCommonAncestorNode();

        selectsTextNode.forEach(function (value) {
            doSpan(value);
        });
    });
}

function doSpan(range) {

    var span = document.createElement("span");
    span.style.backgroundColor = currentColor;
    span.style.color = "black";
    var clone = range.cloneNode(true);
    span.appendChild(clone);
    range.parentNode.replaceChild(span, range);
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
