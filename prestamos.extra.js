// Funciones JS para los nuevos botones en préstamos.html
function buscarPorVozPrestamo() {
  alert('Función de búsqueda por voz (demo)');
}

// Búsqueda real por cámara usando Quagga en préstamos
function buscarPorCamaraPrestamo() {
  const dialog = document.getElementById('camaraDialogPrestamo');
  dialog.style.display = 'block';
  document.getElementById('resultadoCamaraPrestamo').innerText = 'Escaneando...';
  if (!window.Quagga) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/quagga@0.12.1/dist/quagga.min.js';
    script.onload = iniciarQuaggaPrestamo;
    document.body.appendChild(script);
  } else {
    iniciarQuaggaPrestamo();
  }
}

function iniciarQuaggaPrestamo() {
  window.Quagga.init({
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: document.querySelector('#videoCamaraPrestamo'),
      constraints: { width: 400, height: 200, facingMode: 'environment' }
    },
    decoder: { readers: ['code_128_reader', 'ean_reader', 'ean_8_reader'] }
  }, function(err) {
    if (err) {
      document.getElementById('resultadoCamaraPrestamo').innerText = 'Error: ' + err;
      return;
    }
    window.Quagga.start();
  });
  window.Quagga.onDetected(function(result) {
    const codigo = result.codeResult.code;
    document.getElementById('resultadoCamaraPrestamo').innerText = 'Código detectado: ' + codigo;
    window.Quagga.stop();
    // Aquí podrías buscar préstamo por código
    alert('Código de préstamo detectado: ' + codigo);
  });
}

function cerrarCamaraPrestamo() {
  const dialog = document.getElementById('camaraDialogPrestamo');
  dialog.style.display = 'none';
  if (window.Quagga) window.Quagga.stop();
}

function aplicarExcepcion() {
  alert('Excepción de límite aplicada (demo)');
}

function registrarDevolucion() {
  alert('Devolución registrada con éxito (demo)');
}

function verHistorialPrestamos() {
  alert('Historial de préstamos (demo)');
}

function reservarLibro() {
  alert('Libro reservado (demo)');
}
