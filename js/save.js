function setSettings() {

    selectedColor = $("input[name='color']:checked").val();
    if (selectedColor === '') {
        selectedColor = $("#chooseColor").val();
    }

    shortcutValue = $("#shortcut").val();

    browser.storage.sync.set({
        color: selectedColor,
        shortcut: shortcutValue
    }).then(function() {
        browser.storage.sync.get().then(applySetting, error);
    }, error);

}

function error(error) {
    console.log(error);
}

function applySetting(settings) {

    if (settings.color === undefined) {
        settings.color = '#00E4FF';
    }

    if (settings.shortcut === undefined) {
        settings.shortcut = 'h';
    }

    switch (settings.color) {
        case "#ffff00":
        case "#00ff00":
        case "#ff0000":
            $("input[value='" + settings.color + "']").prop("checked", true);
            break;
        default:
            $("input[value='']").prop("checked", true);
            break;
    }

    $("#chooseColor").val(settings.color);
    $("#shortcut").val(settings.shortcut);

}

function clearSettings() {
    browser.storage.sync.set({
        color: undefined,
        shortcut: undefined
    }).then(applySetting, error);
}

browser.storage.sync.get().then(applySetting, error);
$("#clear").click(clearSettings);
$("#submit").click(setSettings);
