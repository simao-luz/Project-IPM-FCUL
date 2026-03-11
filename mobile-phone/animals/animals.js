const speciesInput = document.getElementById("species");
speciesInput.addEventListener("input", () => {
  speciesInput.value = speciesInput.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");
});

const inputChip = document.getElementById("id-num");
inputChip.addEventListener("input", () => {
  inputChip.value = inputChip.value.replace(/[^0-9]/g, "");
});

const form = document.querySelector(".add-animal form");
const animalsScroll = document.getElementById("animals-scroll");
const defaultImgUrl = "../img/default-img.png";

let storedAnimals = JSON.parse(localStorage.getItem("animals") || "[]");

// Animal Billy hardcoded
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
    photo: "../img/billy.jpeg"
  }
];

// Função para criar e adicionar um card no scroll
function addCardToList(animal) {
  const card = document.createElement("button");
  card.className = "card";

  const sex = animal.sex || "";
  const genderEmoji = sex === "macho" ? "♂️" : sex === "femea" ? "♀️" : "";

  card.innerHTML = `
    <img src="${animal.photo || defaultImgUrl}" alt="${animal.name}">
    <div class="card-info">
      <h3>${animal.name} ${genderEmoji}</h3>
      <p>Espécie: ${animal.species}</p>
      <p>Chip: ${animal.chipNumber || "N/A"}</p>
    </div>
  `;

  card.addEventListener("click", () => {
    window.location.href = `../animal-profile/animal-profile.html?id=${animal.id}`;
  });

  animalsScroll.appendChild(card);
  card.scrollIntoView({ behavior: "smooth", inline: "center" });
}

// Renderiza primeiro o Billy e depois os que estão no localStorage
[...baseAnimals, ...storedAnimals].forEach(addCardToList);

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const species = form.species.value.trim();
    const chipNumber = form["id-num"].value.trim();
    const weight = form.weight?.value.trim();
    const photoIn = form.photo.files[0];

    const sexInput = form.querySelector('input[name="sex"]:checked');
    const sex = sexInput ? sexInput.value : "";

    if (!name || !species || !sex || !chipNumber) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const bpm = Math.floor(Math.random() * 40) + 60;
    const temp = (Math.random() * 3 + 36).toFixed(1);
    const idSlug = name.toLowerCase().replace(/\s+/g, "-");

    function saveAnimal(photoUrl) {
      const newAnimal = {
        id: idSlug,
        name,
        species,
        chipNumber,
        weight,
        bpm,
        temp,
        sex,
        photo: photoUrl,
      };

      storedAnimals.push(newAnimal);
      localStorage.setItem("animals", JSON.stringify(storedAnimals));
      addCardToList(newAnimal);

      closePopup();
      form.reset();
    }

    if (photoIn) {
      const reader = new FileReader();
      reader.onload = () => {
        saveAnimal(reader.result);
      };
      reader.readAsDataURL(photoIn);
    } else {
      saveAnimal(defaultImgUrl);
    }
  });
}

document.querySelector(".back").addEventListener("click", () => {
  window.location.href = "../main-page/main-page.html";
});

const addAnimalBtn = document.getElementById("add-animal-btn");
addAnimalBtn.addEventListener("click", () => {
  openPopupByClass(".add-animal");
});
