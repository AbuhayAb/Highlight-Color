function setSettings() {

    selectedColor = $("input[name='color']:checked").val();
    if (selectedColor === '') {
        selectedColor = $("#chooseColor").val();
    }

    shortcutValue = $("#shortcut").val();

    browser.storage.sync.set({
        color: selectedColor,
        shortcut: shortcutValue
    }).then(getItemFromStorgeArea, onError);

}

function onError(error) {
    console.log(error);
}

function applySetting(settings) {

    if (settings.color === undefined) {
        settings.color = '#ffff00';
    }

    if (settings.shortcut === undefined) {
        settings.shortcut = 'h';
    }

    if (settings.color === "#ffff00" || settings.color === "#00ff00" || settings.color === "#ff0000") {
        $("input[value='" + settings.color + "']").prop("checked", true);
    } else {
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
function getItemFromStorgeArea(){
    browser.storage.sync.get().then(applySetting, onError);
}

getItemFromStorgeArea();

$("#clear").click(clearSettings);
$("#submit").click(setSettings);
