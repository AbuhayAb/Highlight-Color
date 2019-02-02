var colorWell;
var defaultColor = "#0000ff";

window.addEventListener("load", startup, false);


function startup() {
  colorWell = document.querySelectorAll("td");
  colorWell.addEventListener("click", updateFirst, false);
  colorWell.addEventListener("change", updateFirst, false);
}

function updateFirst(event) {
  var p = document.querySelector("td");

  if (p) {
    defaultColor = event.target.value;
  }
}

