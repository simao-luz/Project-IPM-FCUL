function moveCardToTop(card) {
  const container = document.getElementById("dispensers-scroll");
  container.prepend(card);
}

function updateCardInfo(id, type) {
  const card = document.querySelector(`.card.${type}[data-id="${id}"]`);
  const quantityElem = card.querySelector(".card-info p");

  if (type === "food") {
    quantityElem.textContent = `Ração: ${stocks[id]} g`;
  } else if (type === "water") {
    let nivel;
    if (stocks[id] > 150) nivel = "Alto";
    else if (stocks[id] > 50) nivel = "Médio";
    else nivel = "Baixo";

    quantityElem.textContent = `Nível de Água: ${nivel}`;
  }

  const timeElem = card.querySelector(".card-time");
  const now = new Date();
  const formattedDate = now.toLocaleDateString("pt-PT", { year: "2-digit", month: "2-digit", day: "2-digit" });
  const formattedTime = now.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
  timeElem.textContent = `${formattedDate} ${formattedTime}`;
}

const stocks = {};
let currentFoodId = null;
let currentWaterId = null;

document.getElementById("add-dispenser-btn").addEventListener("click", () => {
  openPopupByClass(".add-dispenser");
});

const dispensersScroll = document.getElementById("dispensers-scroll");

function createCard(name, type, initialStock = 200) {
  const card = document.createElement("button");
  card.className = `card ${type}`;
  card.setAttribute("data-id", name);

  card.innerHTML = `
    <button class="delete-card-btn" title="Remover animal" aria-label="Apagar animal">✖</button>
    <div class="card-info">
      <h3>${name}</h3>
      <p></p>
    </div>
    <div class="card-time">--:--</div>
  `;

  stocks[name] = initialStock;

  const closeBtn = card.querySelector(".delete-card-btn");
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm(`Tens a certeza que queres remover o dispensador "${name}"?`)) {
      card.remove();
      delete stocks[name];
    }
  });

  card.addEventListener("click", () => {
    const id = card.dataset.id;
    let popupSelector;

    if (card.classList.contains("food")) {
      currentFoodId = id;
      popupSelector = ".food-popup";
    } else if (card.classList.contains("water")) {
      currentWaterId = id;
      popupSelector = ".water-popup";
    }

    const popupNameElem = document.querySelector(`${popupSelector} .dispenser-name`);
    popupNameElem.textContent = `Local: ${id}`;

    if (type === "food") {
      const quantityText = document.querySelector(".food-popup .current-quantity");
      quantityText.textContent = stocks[id] > 0 ? `${stocks[id]} g disponíveis` : "⚠️ Reabastecimento necessário";
    }

    if (type === "water") {
      const waterLevelElem = document.querySelector(".water-popup .water-level");

      if (stocks[id] > 0) {
        let nivel;
        if (stocks[id] > 150) nivel = "Alto";
        else if (stocks[id] > 50) nivel = "Médio";
        else nivel = "Baixo";
        waterLevelElem.textContent = `Nível atual de água: ${nivel}`;
      } else {
        waterLevelElem.textContent = "⚠️ Reabastecimento necessário";
      }
    }

    openPopupByClass(popupSelector);
  });

  dispensersScroll.appendChild(card);
  return card;
}

const form = document.getElementById("dispenser-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form["dispenser-name"].value.trim();
  const type = form["dispenser-type"].value;
  createCard(name, type, 200);
  form.reset();
  closePopup();
});

const input = document.getElementById("limited-input");
const quantityText = document.querySelector(".food-popup .current-quantity");
const dispenseFoodBtn = document.querySelector(".dispense-food-btn");

dispenseFoodBtn.onclick = () => {
  const quantity = parseInt(input.value);
  const dispenserNameElem = document.querySelector(".food-popup .dispenser-name");
  const id = dispenserNameElem.textContent.replace("Local: ", "").trim();

  if (isNaN(quantity) || quantity <= 0) {
    alert("Insere uma quantidade válida.");
    return;
  }

  if (quantity > stocks[id]) {
    alert("Quantidade acima da disponível - Reabastecimento necessário!");
    return;
  }

  stocks[id] -= quantity;
  alert(`Foram dispensados ${quantity}g de comida.`);

  quantityText.textContent = stocks[id] > 0 ? `${stocks[id]} g disponíveis` : "⚠️ Reabastecimento necessário";
  input.max = stocks[id];
  input.value = "";
  updateCardInfo(currentFoodId, "food");

  const card = document.querySelector(`.card.food[data-id="${id}"]`);
  moveCardToTop(card);

  closePopup();
};

const dispenseWaterBtn = document.querySelector(".dispense-water-btn");
const waterLevel = document.querySelector(".water-popup .water-level");

dispenseWaterBtn.addEventListener("click", () => {
  stocks[currentWaterId] -= 50;

  if (stocks[currentWaterId] <= 0) {
    stocks[currentWaterId] = 0;
    waterLevel.textContent = "⚠️ Reabastecimento necessário";
    alert("É necessário reabastecer o depósito de água!");
  } else {
    let nivel;
    if (stocks[currentWaterId] > 100) nivel = "Alto";
    else if (stocks[currentWaterId] > 50) nivel = "Médio";
    else nivel = "Baixo";

    waterLevel.textContent = `Nível atual de água: ${nivel}`;
    alert("Água dispensada com sucesso!");
  }

  const card = document.querySelector(`.card.water[data-id="${currentWaterId}"]`);
  updateCardInfo(currentWaterId, "water");
  moveCardToTop(card);
  closePopup();
});

const autoRefillCheckbox = document.getElementById("auto-refill");
autoRefillCheckbox.addEventListener("change", () => {
  alert(autoRefillCheckbox.checked ? "Reposição automática ativada!" : "Reposição automática desativada!");
});

document.querySelector(".back").addEventListener("click", () =>
  window.location.href = "../main-page/main-page.html"
);
