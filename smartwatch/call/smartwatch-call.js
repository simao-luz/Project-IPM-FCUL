function goToMainPage() {
  window.location.href = '../main/smartwatch-main.html';
}

var hangup = document.getElementById('hangupBtn');
if (hangup) {
  hangup.addEventListener('click', goToMainPage);
}