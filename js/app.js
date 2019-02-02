function clickColor (choice) {
    pickedColor = choice
};
squares.addEventListener('click', clickColor());

var colorWell;
var defaultColor = "#0000ff";

window.addEventListener("load", startup, false);


function startup() {
  colorWell = document.querySelector("#colorWell");
  colorWell.value = defaultColor;
  colorWell.addEventListener("input", updateFirst, false);
  colorWell.addEventListener("change", updateAll, false);
  colorWell.select();
}

function updateFirst(event) {
  var p = document.querySelector("p");

  if (p) {
    p.style.color = event.target.value;
  }
}
function watchColorPicker(event) {
  document.querySelectorAll("p").forEach(function(p) {
    p.style.color = event.target.value;
  });
}

