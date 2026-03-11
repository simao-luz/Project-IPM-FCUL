const form         = document.querySelector("form");
const userIn       = document.getElementById("username");
const passwordInput= document.getElementById("password");
const togglePw     = document.getElementById("toggle-pw");
const msg          = document.getElementById("error-msg");

function toggle_pw() {
  const occult = passwordInput.type === "password"; // Está oculto?
  passwordInput.type = occult ? "text" : "password";
  togglePw.src = occult ? "../img/eye-open.png" : "../img/eye-closed.png";
}

function check_fields() {
  const username = userIn.value.trim();
  const password = passwordInput.value;

  const hasSpaces = /\s/.test(username);
  if (hasSpaces || username.length === 0) {
    msg.textContent = "Username não pode conter espaços e não pode estar vazio.";
    msg.hidden = false;
    return false;
  }

  // Password: mínimo 6 caracteres, pelo menos 1 número, pelo menos 1 caractere especial
  const passwordValid = /^(?=.*[0-9])(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{6,}$/.test(password);
  if (!passwordValid) {
    msg.textContent = "Password deve ter mínimo 6 caracteres, pelo menos 1 número e 1 caractere especial.";
    msg.hidden = false;
    return false;
  }

  msg.hidden = true;
  return true;
}

function check_submission(event) {
  event.preventDefault();

  if (!check_fields()) {
    return;
  }

  localStorage.setItem("username", userIn.value.trim());
  window.location.href = "../main-page/main-page.html";
}

togglePw.addEventListener("click", toggle_pw);
form.addEventListener("submit", check_submission);
