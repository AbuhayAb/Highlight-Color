/**
 * goes through all nodes from range.commonAncestorContainer in the document
 * reduces the set in the acceptNode() method,
 * only accept nodes that in the range and the node is not whitespace,
 * and then makes use of tree walker iterator that is created to advance through the nodes (now all elements)
 * and push them into an array nodeList
 * credit: https://stackoverflow.com/questions/10730309/find-all-text-nodes-in-html-page/10730777#10730777
 * @returns {Array}
 */
function getTextFromCommonAncestorNode(range) {
    var treeWalker = document.createTreeWalker(
        // Node to use as root
        range.commonAncestorContainer,
        //Only consider nodes that are text nodes
        NodeFilter.SHOW_TEXT,
        // Object containing the function to use for the acceptNode method of the NodeFilter
        {
            acceptNode: function (node) {
                // Logic to determine whether to accept, reject or skip node
                // In this case, only accept nodes that in the range and the node is not whitespace
                if (range.isPointInRange(node, 0) && node.data.replace(/[\s]+/, "").length > 0) {
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        },
        // flag indicating if when discarding an EntityReference its whole sub-tree
        // must be discarded at the same time.
        false
    );

    var node;
    var nodeList = [];
    while (node = treeWalker.nextNode()) nodeList.push(node);

    // if it si only one words
    if (nodeList.length === 0) {
        var startNode = range.startContainer;
        var startOffset = range.startOffset;
        var endOffset = range.endOffset;
        node = startNode.splitText(startOffset);
        node.splitText(endOffset - startOffset);
        nodeList.push(node);
        return nodeList;
    }

    // for last word
    if (!nodeList.includes(range.endContainer)) {
        nodeList.push(range.endContainer);
    }
    //for first word
    if (!nodeList.includes(range.startContainer)) {
        nodeList.push(range.startContainer);
    }

    return nodeList;

}

function makeHighlightSelection() {
    var selection = window.getSelection();
    for (var i = 0; i < selection.rangeCount; i++) {
        var allNodeThatHaveTextInSelectionRange = getTextFromCommonAncestorNode(selection.getRangeAt(i));
        allNodeThatHaveTextInSelectionRange.forEach(function (range) {
            doSpan(range);
        });
    }
}


function doSpan(oldChild) {

    var newChild = document.createElement("span");
    newChild.style.backgroundColor = currentColor;
    newChild.style.color = "black";
    newChild.className = "67111";
    newChild.appendChild(oldChild.cloneNode(true));
    oldChild.parentNode.replaceChild(newChild, oldChild);
}

function highlightSelection(event) {
    if (event.key === currentShortcut) {
        reloadSettings(makeHighlightSelection);
    }
}

document.addEventListener("keydown", highlightSelection);

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
