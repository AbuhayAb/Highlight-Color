function setSettings() {

    // var selectedColor = document.querySelector("input[name='color']:checked").value;
    var selectedColor = $("input[name='color']:checked").val();
    if (selectedColor === '') {
        // selectedColor = document.querySelector("#chooseColor").val();
        selectedColor = $("#chooseColor").val();

    }

    var shortcutValue = $("#shortcut").val();
    // Items in sync storage are synced by the browser,
    // and are available across all instances of that browser that the user is logged into
    browser.storage.sync.set({
        color: selectedColor,
        shortcut: shortcutValue
    }).then(gettingStoredSettings, onError);

}

// Generic error logger.
function onError(e) {
    console.log(e);
}

function applySetting(settings) {
    if (settings.color === undefined) {
        settings.color = '#ffff00';
    }

    if (settings.shortcut === undefined) {
        settings.shortcut = 'h';
    }

    if (settings.color === "#ffff00" || settings.color === "#00ff00" || settings.color === "#ff0000") {
        // document.querySelector("input[value='" + settings.color + "']").checked;
        $("input[value='" + settings.color + "']").prop("checked", true);
    } else {
        // document.querySelector("input[value='']").checked;
        $("input[value='']").prop("checked", true);
    }

    $("#chooseColor").val(settings.color);
    $("#shortcut").val(settings.shortcut);

}

function clearSettings() {
    browser.storage.sync.set({
        color: undefined,
        shortcut: undefined
    }).then(applySetting, onError);
}

function gettingStoredSettings() {
    browser.storage.sync.get().then(applySetting, onError);
}

gettingStoredSettings();

/**
 * Handle update and reset button clicks
 */
// document.querySelector('#clear').addEventListener('click', clearSettings)
// document.querySelector('#update').addEventListener('click', setSettings)

$("#clear").click(clearSettings);
$("#update").click(setSettings);
