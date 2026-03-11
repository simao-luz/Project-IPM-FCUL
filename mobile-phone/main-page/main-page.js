const container = document.querySelector(".background-circle");
const containerWidth = container.clientWidth;
const radius = containerWidth / 2;
const items = container.querySelectorAll(".item");

items.forEach(item => {
  const i = parseInt(item.getAttribute("data-i"));
  const angleRad = (i * 2 * Math.PI) / items.length;

  const x = radius * Math.cos(angleRad);
  const y = radius * Math.sin(angleRad);

  item.style.setProperty("--pos-x", `${x}px`);
  item.style.setProperty("--pos-y", `${y}px`);
});


var helpBtn = document.querySelector(".help");
helpBtn.addEventListener("click", () => openPopupByClass(".help-popup"));


// Ligações a outros HTML;
document.getElementById("dispensers").addEventListener("click", () =>
  window.location.href = '../dispensers/dispensers.html'
);

document.getElementById("locations").addEventListener("click", () =>
  window.location.href = "../locations/locations.html"
);

document.getElementById("my-animals").addEventListener("click", () =>
  window.location.href = '../animals/animals.html'
);

document.getElementById("emergency").addEventListener("click", () =>
  openPopupByClass(".emergency-popup")
);

const yesBtn = document.querySelector(".emergency-popup .yes-btn");
yesBtn.addEventListener("click", () => window.location.href = "emergency-call.html");




