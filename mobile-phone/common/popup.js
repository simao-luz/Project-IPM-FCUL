let activePopup = null;

function openPopupByClass(popupClass) {
  closePopup();

  const popup = document.querySelector(`${popupClass}`);
  const mainContent = document.querySelector(".main-content");

  popup.style.display = "flex";
  mainContent.style.filter = "blur(1.5px)";
  mainContent.style.pointerEvents = "none";

  activePopup = popup;
}

function closePopup() {
  const mainContent = document.querySelector(".main-content");

  if (activePopup) {
    activePopup.style.display = "none";
    activePopup = null;
  }

  mainContent.style.filter = "none";
  mainContent.style.pointerEvents = "auto";
}

// Todos os botões para fechar popups são de classe "close-btn"...;
const closeBtns = document.querySelectorAll(".close-btn");

closeBtns.forEach(btn => {
  btn.addEventListener("click", () => closePopup());
});
