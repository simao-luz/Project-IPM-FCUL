const baseAnimals = [
  {
    id: "billy",
    name: "Billy",
    species: "Cão",
    chipNumber: "379817313",
    weight: "12kg",
    bpm: 90,
    temp: 38.4,
    sex: "macho",
    photo: "../img/billy.jpeg",
    details: {
      age: "5 anos",
      weight: "12kg",
      nationality: "Portugal",
      favouriteSound: "Porta a abrir",
      favouriteActivity: "Esconder brinquedos",
      training: "Sim, responde a 'Senta' e 'Aqui'",
      favouriteToy: "Bola com guizo",
      vaccinated: "Sim"
    }
  }
];

const params = new URLSearchParams(location.search);
const animalId = params.get("id");

let storedAnimals = JSON.parse(localStorage.getItem("animals") || "[]");
let animal = storedAnimals.find(a => a.id === animalId);

if (!animal) {
  animal = baseAnimals.find(a => a.id === animalId);
}

if (!animal) {
  alert("Animal não encontrado!");
  window.location.href = "../animals/animals.html";
}

const sexEmoji = animal.sex === "macho" ? "♂️" : animal.sex === "femea" ? "♀️" : "";
document.querySelector(".animal-info-panel h2").textContent = `${animal.name} ${sexEmoji}`;

document.querySelector(".img-container img").src = animal.photo || "../img/default-img.png";

const dataParagraphs = document.querySelectorAll(".data p");

dataParagraphs[0].textContent = "Espécie: " + (animal.species || "N/A");
dataParagraphs[1].textContent = "Chip: " + (animal.chipNumber || "N/A");


const detailValues = [
  animal.details?.age || "",
  animal.details?.weight || "",
  animal.details?.nationality || "",
  animal.details?.favouriteSound || "",
  animal.details?.favouriteActivity || "",
  animal.details?.training || "",
  animal.details?.favouriteToy || "",
  animal.details?.vaccinated || ""
];

const detailEditables = document.querySelectorAll(".detail-editable");
detailEditables.forEach((el, i) => {
  el.textContent = detailValues[i] || "";
});

function saveAnimalChanges() {
  const index = storedAnimals.findIndex(a => a.id === animal.id);
  if (index !== -1) {
    storedAnimals[index] = animal;
    localStorage.setItem("animals", JSON.stringify(storedAnimals));
  }
}

document.querySelectorAll(".detail-row").forEach(row => {
  const editBtn = row.querySelector(".edit-button");
  const confirmBtn = row.querySelector(".confirm-button");
  const cancelBtn = row.querySelector(".cancel-button");
  const editable = row.querySelector(".detail-editable");

  let originalText = "";

  editBtn.addEventListener("click", () => {
    originalText = editable.textContent.trim();
    editable.setAttribute("contenteditable", "true");
    editable.focus();

    editBtn.addEventListener("click", () => {
      originalText = editable.textContent.trim();
      editable.setAttribute("contenteditable", "true");
      editable.focus();

      function keepCursorVisible() {
        editable.scrollLeft = editable.scrollWidth;
      }
      editable.addEventListener("input", keepCursorVisible);
      editable.addEventListener(
        "blur",
        () => editable.removeEventListener("input", keepCursorVisible),
        { once: true }
      );

      editBtn.style.display = "none";
      confirmBtn.style.display = "inline";
      cancelBtn.style.display = "inline";
    });


    editBtn.style.display = "none";
    confirmBtn.style.display = "inline";
    cancelBtn.style.display = "inline";
  });

  confirmBtn.addEventListener("click", () => {
    editable.setAttribute("contenteditable", "false");

    const detailKeys = [
      "age",
      "weight",
      "nationality",
      "favouriteSound",
      "favouriteActivity",
      "training",
      "favouriteToy",
      "vaccinated"
    ];

    const rowIndex = Array.from(document.querySelectorAll(".detail-row")).indexOf(row);

    if (!animal.details) animal.details = {};

    animal.details[detailKeys[rowIndex]] = editable.textContent.trim();

    saveAnimalChanges();
    toggleButtons();
    showToast("Salvo com sucesso!");
  });

  cancelBtn.addEventListener("click", () => {
    editable.textContent = originalText;
    editable.setAttribute("contenteditable", "false");
    toggleButtons();
  });

  function toggleButtons() {
    editBtn.style.display = "inline";
    confirmBtn.style.display = "none";
    cancelBtn.style.display = "none";
  }
});

function showToast(msg, duration = 1500) {
  const container = document.querySelector(".main-content");
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  container.appendChild(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => container.removeChild(t), 300);
  }, duration);
}

document.querySelector(".back").addEventListener("click", () => {
  window.location.href = "../animals/animals.html";
});

