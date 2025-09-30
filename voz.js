// Módulo de entrada/salida por voz (demo)
function reconocerVoz() {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Reconocimiento de voz no soportado en este navegador.');
    return '';
  }
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.continuous = false;
  recognition.interimResults = false;
  return new Promise((resolve) => {
    recognition.onresult = function(event) {
      resolve(event.results[0][0].transcript);
    };
    recognition.onerror = function() {
      resolve('');
    };
    recognition.start();
  });
}

function sintetizarVoz(texto) {
  if (!('speechSynthesis' in window)) {
    alert('Síntesis de voz no soportada.');
    return;
  }
  const utter = new SpeechSynthesisUtterance(texto);
  utter.lang = 'es-ES';
  window.speechSynthesis.speak(utter);
}

module.exports = { reconocerVoz, sintetizarVoz };
