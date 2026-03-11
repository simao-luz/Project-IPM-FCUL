const reminders = [
  {
    title: "Dispensador automático ativado",
    date: "22/05/2025",
    description: "Próxima dispensão marcada para as 10h00"
  },
  {
    title: "Billy fora da sua área segura",
    date: "20/05/2025",
    description: "O seu animal Billy foi localizado a 50m da sua área segura"
  },
  {
    title: "Consulta de emergência efetuada",
    date: "13/04/2025",
    description: "Consulta de emergência para Dr. José Veiga efetuada"
  }
];

const services = [
  {
    title: "Próxima consulta",
    date: "30/06/2025",
    description: "Próxima consulta de Billy está marcada para a data acima"
  },
  {
    title: "Treino para Billy",
    date: "2/07/2025",
    description: "Fim-de-semana com treinador profissional para Billy marcado para a data acima"
  }
];


function createEventItem(event) {
  const div = document.createElement("div");
  div.className = "event-item";

  const titleEl = document.createElement("div");
  titleEl.className = "title";

  const titleSpan = document.createElement("span");
  titleSpan.textContent = event.title;

  const dateSpan = document.createElement("span");
  dateSpan.className = "date";
  dateSpan.textContent = event.date;

  titleEl.appendChild(titleSpan);
  titleEl.appendChild(dateSpan);

  const descEl = document.createElement("div");
  descEl.className = "description";
  descEl.textContent = event.description;

  div.appendChild(titleEl);
  div.appendChild(descEl);

  return div;
}

function populateEvents(listId, events) {
  const container = document.getElementById(listId);
  events.forEach(event => {
    const eventEl = createEventItem(event);
    container.appendChild(eventEl);
  });
}

populateEvents("reminders-list", reminders);
populateEvents("services-list", services);

document.querySelector(".back").addEventListener("click", () => {
  window.location.href = "../main-page/main-page.html";
});