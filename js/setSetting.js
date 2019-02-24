function setSettings() {

    // var selectedColor = document.querySelector("input[name='color']:checked").value;
    var selectedColor = $("input[name='color']:checked").val();
    if (selectedColor === '') {
        // selectedColor = document.querySelector("#chooseColor").val();
        selectedColor = $("#chooseColor").val();

    }

    var shortcutValue = $("#shortcut").val();

    browser.storage.sync.set({
        color: selectedColor,
        shortcut: shortcutValue
    }).then(getItemFromStorageArea, onError);

}

function onError(error) {
    console.log(error);
}

function applySetting(settings) {
    console.log("here");
    if (settings.color === undefined) {
        settings.color = '#ffff00';
    }

    if (settings.shortcut === undefined) {
        settings.shortcut = 'h';
    }

    if (settings.color === "#ffff00" || settings.color === "#00ff00" || settings.color === "#ff0000") {
        // document.querySelector("input[value='" + settings.color + "']").checked;
        $("input[value='" + settings.color + "']").prop("checked");
    } else {
        // document.querySelector("input[value='']").checked;
        $("input[value='']").prop("checked");
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
function getItemFromStorageArea(){
    browser.storage.sync.get().then(applySetting, onError);
}

getItemFromStorageArea();

$("#clear").click(clearSettings);
$("#submit").click(setSettings);
