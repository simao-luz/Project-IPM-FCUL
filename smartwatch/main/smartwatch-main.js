document.addEventListener('DOMContentLoaded', function() {
  var emergencyBtn    = document.querySelector('.emergency-btn');
  var animalsBtn      = document.querySelector('.animals-btn');
  var popupOverlay    = document.getElementById('emergencyPopup');
  var yesBtn          = document.querySelector('.yes-btn');
  var noBtn           = document.querySelector('.no-btn');


  emergencyBtn.addEventListener('click', function() {
    popupOverlay.style.display = 'flex';
  });

  yesBtn.addEventListener('click', function() {
      window.location.href = '../call/smartwatch-call.html';
    });

  animalsBtn.addEventListener('click', function() {
      window.location.href = '../animals/animals.html';
    });

    noBtn.addEventListener('click', function() {
      popupOverlay.style.display = 'none';
    });
  });