function handlePinSubmit(event) {
  event.preventDefault();
  var pinInput = document.getElementById('pin');
  var pinValue = pinInput.value.trim();

  // só redireciona se tiver exatamente 4 dígitos
  if (pinValue.length === 4 && /^\d{4}$/.test(pinValue)) {
    window.location.href = '../main/smartwatch-main.html';
  } else {
    // opcional: feedback ao utilizador
    pinInput.value = '';
    pinInput.focus();
    // aqui podias animar ou mostrar um erro, por exemplo:
    // alert('Por favor, insira um PIN de 4 dígitos.');
  }
}

// função de inicialização, liga o handler ao form
function initSmartwatchLogin() {
  var form = document.getElementById('pinForm');
  form.addEventListener('submit', handlePinSubmit);
}

// executa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  initSmartwatchLogin();
});