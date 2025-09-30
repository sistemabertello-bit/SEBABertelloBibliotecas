// Módulo de entrada por cámara (demo)
function escanearCodigo(callback) {
  if (!window.Quagga) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/quagga@0.12.1/dist/quagga.min.js';
    script.onload = () => iniciarQuagga(callback);
    document.body.appendChild(script);
  } else {
    iniciarQuagga(callback);
  }
}

function iniciarQuagga(callback) {
  window.Quagga.init({
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: document.createElement('video'),
      constraints: { width: 400, height: 200, facingMode: 'environment' }
    },
    decoder: { readers: ['code_128_reader', 'ean_reader', 'ean_8_reader'] }
  }, function(err) {
    if (err) {
      callback('Error: ' + err);
      return;
    }
    window.Quagga.start();
  });
  window.Quagga.onDetected(function(result) {
    const codigo = result.codeResult.code;
    window.Quagga.stop();
    callback(codigo);
  });
}

module.exports = { escanearCodigo };
