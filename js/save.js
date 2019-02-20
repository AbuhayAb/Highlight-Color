function setSettings() {
    if ('localStorage' in window && window['localStorage'] !== null) {
        try {

            color = $("input[name='color']:checked").val();
            if (color == '') {
                color = $("#favcolor").val();
            }

            localStorage.color = color;
            shortcut = $("#shortcut").val();
            localStorage.shortcut = shortcut;
            applySetting();
        } catch (e) {
            if (e == QUOTA_EXCEEDED_ERR) {
                alert('Quota exceeded!');
            }
        }
    } else {
        alert('Cannot store user storage');
    }
}

function applySetting() {

    if (localStorage.color === undefined) {
        localStorage.color = '#00E4FF';
    }

    if (localStorage.shortcut === undefined) {
        localStorage.shortcut = 'h';
    }

    switch (localStorage.color) {
        case "#ffff00":
        case "#00ff00":
        case "#ff0000":
            $("input[value='" + localStorage.color + "']").prop("checked", true);
            break;
        default:
            $("input[value='']").prop("checked", true);
            break;
    }

    $("#favcolor").val(localStorage.color);
    $("#shortcut").val(localStorage.shortcut);

}

function clearSettings() {
    localStorage.removeItem("favcolor");
    localStorage.removeItem("shortcut");
    applySetting();
}

applySetting();
$("#clear").click(clearSettings);
$("#submit").click(setSettings);
