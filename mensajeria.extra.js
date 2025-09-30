// Búsqueda real por cámara usando Quagga en mensajería
function buscarPorCamaraMensajeria() {
  const dialog = document.getElementById('camaraDialogMensajeria');
  dialog.style.display = 'block';
  document.getElementById('resultadoCamaraMensajeria').innerText = 'Escaneando...';
  if (!window.Quagga) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/quagga@0.12.1/dist/quagga.min.js';
    script.onload = iniciarQuaggaMensajeria;
    document.body.appendChild(script);
  } else {
    iniciarQuaggaMensajeria();
  }
}

function iniciarQuaggaMensajeria() {
  window.Quagga.init({
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: document.querySelector('#videoCamaraMensajeria'),
      constraints: { width: 400, height: 200, facingMode: 'environment' }
    },
    decoder: { readers: ['code_128_reader', 'ean_reader', 'ean_8_reader'] }
  }, function(err) {
    if (err) {
      document.getElementById('resultadoCamaraMensajeria').innerText = 'Error: ' + err;
      return;
    }
    window.Quagga.start();
  });
  window.Quagga.onDetected(function(result) {
    const codigo = result.codeResult.code;
    document.getElementById('resultadoCamaraMensajeria').innerText = 'Código detectado: ' + codigo;
    window.Quagga.stop();
    alert('Código de mensajería detectado: ' + codigo);
  });
}

function cerrarCamaraMensajeria() {
  const dialog = document.getElementById('camaraDialogMensajeria');
  dialog.style.display = 'none';
  if (window.Quagga) window.Quagga.stop();
}
// Funciones JS para los nuevos botones en mensajeria.html
function usarPlantilla() {
  alert('Función de plantillas (demo)');
}

function enviarProgramado() {
  alert('Envío programado (demo)');
}

function configurarCanales() {
  alert('Configuración de canales (demo)');
}

function buscarPorFiltroMensajeria() {
  alert('Búsqueda por filtro (demo)');
}
