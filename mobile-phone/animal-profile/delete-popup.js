const deleteBtn = document.getElementById("delete-button");
const popup = document.querySelector(".delete-popup");
const yesBtn = document.querySelector(".yes-btn");

deleteBtn.addEventListener('click', () => {
  openPopupByClass(".delete-popup");
});


yesBtn.addEventListener('click', () => {
  let animals = JSON.parse(localStorage.getItem('animals') || '[]');
  animals = animals.filter(a => a.id !== animalId);
  localStorage.setItem('animals', JSON.stringify(animals));

  popup.style.display = 'none';
  window.location.href = '../animals/animals.html';
});
