const nameEl  = document.getElementById("username");

const storedUser = localStorage.getItem("username") || "Convidado";

nameEl.textContent = storedUser;

document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("username");
  window.location.href = "../login/login.html";
});

document.querySelector(".back").addEventListener("click", () =>
  window.location.href = "../main-page/main-page.html"
);


document.getElementById("logout-btn").addEventListener("click", () =>
  window.location.href = "../login/login.html"
);

document.getElementById("push-toggle").addEventListener("change", e=>{
  console.log("Push notifications:", e.target.checked ? "ON" : "OFF");
});