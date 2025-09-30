// Búsqueda real por cámara usando Quagga en reportes
function buscarPorCamaraReporte() {
  const dialog = document.getElementById('camaraDialogReporte');
  dialog.style.display = 'block';
  document.getElementById('resultadoCamaraReporte').innerText = 'Escaneando...';
  if (!window.Quagga) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/quagga@0.12.1/dist/quagga.min.js';
    script.onload = iniciarQuaggaReporte;
    document.body.appendChild(script);
  } else {
    iniciarQuaggaReporte();
  }
}

function iniciarQuaggaReporte() {
  window.Quagga.init({
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: document.querySelector('#videoCamaraReporte'),
      constraints: { width: 400, height: 200, facingMode: 'environment' }
    },
    decoder: { readers: ['code_128_reader', 'ean_reader', 'ean_8_reader'] }
  }, function(err) {
    if (err) {
      document.getElementById('resultadoCamaraReporte').innerText = 'Error: ' + err;
      return;
    }
    window.Quagga.start();
  });
  window.Quagga.onDetected(function(result) {
    const codigo = result.codeResult.code;
    document.getElementById('resultadoCamaraReporte').innerText = 'Código detectado: ' + codigo;
    window.Quagga.stop();
    alert('Código de reporte detectado: ' + codigo);
  });
}

function cerrarCamaraReporte() {
  const dialog = document.getElementById('camaraDialogReporte');
  dialog.style.display = 'none';
  if (window.Quagga) window.Quagga.stop();
}
// Funciones JS para los nuevos botones en reportes.html
function exportarReporte(tipo) {
  alert('Exportar reporte a ' + tipo + ' (demo)');
}

function personalizarReporte() {
  alert('Personalización de reporte (demo)');
}
