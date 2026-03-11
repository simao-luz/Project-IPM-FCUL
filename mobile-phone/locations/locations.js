// Função geradora de cor aleatória retirada de: https://stackoverflow.com/a/1484514;
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function createIconHtml(imgUrl, pinColor) {
  return `
    <div class="custom-marker">
      <svg class="gps-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="50" height="60">
        <path d="M50 0C72 0 90 18 90 40C90 70 50 120 50 120C50 120 10 70 10 40C10 18 28 0 50 0Z" fill="${pinColor}"/>
      </svg>
      <img src="${imgUrl}" class="animal-img" />
    </div>
  `;
}

function createCustomMarker(imgUrl) {
  const corPin = getRandomColor();
  const html = createIconHtml(imgUrl, corPin);

  return L.divIcon({
    className: '',
    html: html,
    iconSize: [50, 60],
    iconAnchor: [30, 70],
    popupAnchor: [0, -70]
  });
}

function createBindPopupHtml(animal) {
  return `
    <div class="animal-bind-popup">
      <h2>${animal.name}</h2>
      <button class="define-safe-zone-btn" data-animal="${animal.name}">
        Definir zona segura
      </button>
    </div>
  `;
}

const map = L.map(document.querySelector(".map")).setView([38.7169, -9.1399], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors"}).addTo(map);

var definingSafeZone = false;

let animals = [
  { name: "Billy", img: "../img/billy.jpeg", coords: [38.7169, -9.1399] }
];

let billyMarker;

animals.forEach(animal => {
  const customMarker = createCustomMarker(animal.img);
  const marker = L.marker(animal.coords, { icon: customMarker }).addTo(map);

  marker.bindPopup(createBindPopupHtml(animal));

  if (animal.name === "Billy") {
    billyMarker = marker;
  }
});

map.on("popupopen", function (event) {
  const popupNode = event.popup._contentNode;
  const safeZoneBtn = popupNode.querySelector(".define-safe-zone-btn");
  const nomeAnimal = safeZoneBtn.dataset.animal;
  const animal = animals.find(animal => animal.name === nomeAnimal);

  if (animal.safeZone) {
    safeZoneBtn.textContent = "Editar zona segura";
  }

  safeZoneBtn.addEventListener("click", () => {
    if (definingSafeZone) {
      alert("Já estás a definir uma zona segura!");
      return;
    }

    const baseRadius = animal.safeZone ? animal.safeZone.radius : 100;
    const initialCenter = animal.safeZone ? animal.safeZone.center : animal.coords;


    definingSafeZone = true;
    event.popup._source.closePopup();

    document.getElementById("confirm-zone").style.display = "block";
    document.getElementById("animal-name").textContent = animal.name;

    const circle = L.circle(initialCenter, {
      radius: baseRadius,
      color: "red",
      fillColor: "#C93B4B",
      fillOpacity: 0.4
      }).addTo(map);

    const interactiveRing = L.circle(initialCenter, {
      radius: baseRadius,
      color: "#A42B1D",
      fillColor: "transparent",
      weight: 15,
      fillOpacity: 0,
      interactive: true
    }).addTo(map);

    const dragHandle = L.marker(initialCenter, {
      draggable: true,
      opacity: 1
    }).addTo(map);

    dragHandle.on("drag", (event) => {
      const newCenter = event.target.getLatLng();
      circle.setLatLng(newCenter);
      interactiveRing.setLatLng(newCenter);
    });

    interactiveRing.on("mousedown", (event) => {
      const center = circle.getLatLng();
      const distance = center.distanceTo(event.latlng);
      const currentRadius = circle.getRadius();

      if (Math.abs(distance - currentRadius) > 15) return;

      map.dragging.disable();
      map.on("mousemove", onMouseMove);
      map.on("mouseup", onMouseUp);
    });

    function onMouseMove(event) {
      const center = circle.getLatLng();
      const newRadius = center.distanceTo(event.latlng)
      circle.setRadius(newRadius);
      interactiveRing.setRadius(newRadius);
    }

    function onMouseUp() {
      map.off("mousemove", onMouseMove);
      map.off("mouseup", onMouseUp);
      map.dragging.enable();
    }

    const confirmBtn = document.getElementById("confirm-zone-btn");
    confirmBtn.onclick = () => {
      document.getElementById("confirm-zone").style.display = "none"; // Esconde o popup

      animal.safeZone = {
        center: circle.getLatLng(),
        radius: circle.getRadius(),
        circle: circle
      };

      map.removeLayer(circle);
      map.removeLayer(interactiveRing);
      map.removeLayer(dragHandle);
      definingSafeZone = false;

      alert("Zona segura confirmada com sucesso!");
    };

    const cancelBtn = document.getElementById("cancel-zone-btn");
    cancelBtn.onclick = () => {
      document.getElementById("confirm-zone").style.display = "none";

      map.removeLayer(circle);
      map.removeLayer(interactiveRing);
      map.removeLayer(dragHandle);
      definingSafeZone = false;

      alert("Definição de zona segura cancelada.");
    };
  });

  // Se já há safezone
  if (animal.safeZone) {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Apagar zona segura";
    deleteBtn.classList.add("delete-safe-zone-btn");
    deleteBtn.dataset.animal = nomeAnimal;

    popupNode.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", () => {
      map.removeLayer(animal.safeZone.circle);
      delete animal.safeZone;
      alert("Zona segura apagada!");

      // Muda o texto do botão "Definir zona segura"
       const defineSafeZoneBtn = popupNode.querySelector(".define-safe-zone-btn");
      defineSafeZoneBtn.textContent = "Definir zona segura";

      deleteBtn.remove();
    });
  }
});

function isInsideSafeZone(latlng, safeZone) {
  if (!safeZone) return true;
  const center = safeZone.center;
  const radius = safeZone.radius;
  const distance = map.distance(latlng, center);
  return distance <= radius;
}

function showAlert(message) {
  const popup = document.getElementById("alert-popup");
  const msgEl = document.getElementById("alert-message");
  const closeBtn = document.getElementById("alert-close-btn");

  msgEl.textContent = message;
  popup.style.display = "flex";

  function closeHandler() {
    popup.style.display = "none";
    closeBtn.removeEventListener("click", closeHandler);
  }

  closeBtn.addEventListener("click", closeHandler);
}

document.getElementById("portugal-btn").addEventListener("click", () => {
  if (!billyMarker) return;

  const lisbonCoords = L.latLng(38.7169, -9.1399);

  const billyAnimal = animals.find(a => a.name === "Billy");
  const insideSafeZone = isInsideSafeZone(lisbonCoords, billyAnimal.safeZone);

  billyMarker.setLatLng(lisbonCoords);
  map.setView(lisbonCoords, 13);
  map.closePopup();

  if (billyAnimal) {
    billyAnimal.coords = [lisbonCoords.lat, lisbonCoords.lng];
  }

  if (!insideSafeZone) {
    showAlert("ALERTA:\nO Billy saiu da sua zona segura");

}
});

document.getElementById("nepal-btn").addEventListener("click", () => {
  if (!billyMarker) return;

  const kathmanduCoords = L.latLng(27.7172, 85.3240);

  const billyAnimal = animals.find(a => a.name === "Billy");

  const insideSafeZone = isInsideSafeZone(kathmanduCoords, billyAnimal.safeZone);

  billyMarker.setLatLng(kathmanduCoords);
  map.setView(kathmanduCoords, 13);
  map.closePopup();

  if (billyAnimal) {
    billyAnimal.coords = [kathmanduCoords.lat, kathmanduCoords.lng];
  }

  if (!insideSafeZone) {
    showAlert("ALERTA:\nO Billy saiu da sua zona segura");

  }
});

window.addEventListener("beforeunload", (event) => {
  if (definingSafeZone) {
    event.preventDefault();
    event.returnValue = "";
  }
});

document.querySelector(".back").addEventListener("click", () =>
  window.location.href = "../main-page/main-page.html"
);

