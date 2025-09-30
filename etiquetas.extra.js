// Búsqueda real por cámara usando Quagga en etiquetas
function buscarPorCamaraEtiquetas() {
  const dialog = document.getElementById('camaraDialogEtiquetas');
  dialog.style.display = 'block';
  document.getElementById('resultadoCamaraEtiquetas').innerText = 'Escaneando...';
  if (!window.Quagga) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/quagga@0.12.1/dist/quagga.min.js';
    script.onload = iniciarQuaggaEtiquetas;
    document.body.appendChild(script);
  } else {
    iniciarQuaggaEtiquetas();
  }
}

function iniciarQuaggaEtiquetas() {
  window.Quagga.init({
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: document.querySelector('#videoCamaraEtiquetas'),
      constraints: { width: 400, height: 200, facingMode: 'environment' }
    },
    decoder: { readers: ['code_128_reader', 'ean_reader', 'ean_8_reader'] }
  }, function(err) {
    if (err) {
      document.getElementById('resultadoCamaraEtiquetas').innerText = 'Error: ' + err;
      return;
    }
    window.Quagga.start();
  });
  window.Quagga.onDetected(function(result) {
    const codigo = result.codeResult.code;
    document.getElementById('resultadoCamaraEtiquetas').innerText = 'Código detectado: ' + codigo;
    window.Quagga.stop();
    alert('Código de etiqueta detectado: ' + codigo);
  });
}

function cerrarCamaraEtiquetas() {
  const dialog = document.getElementById('camaraDialogEtiquetas');
  dialog.style.display = 'none';
  if (window.Quagga) window.Quagga.stop();
}
// Funciones JS para etiquetas y códigos de barras
function generarEtiqueta() {
  const inventario = document.querySelector('input[name="inventario"]').value;
  const ubicacion = document.querySelector('input[name="ubicacion"]').value;
  const signatura = document.querySelector('input[name="signatura"]').value;
  const etiqueta = `Etiqueta: ${inventario} | ${ubicacion} | ${signatura}`;
  document.getElementById('previewEtiqueta').textContent = etiqueta;
  alert('Etiqueta generada (demo)');
}

function imprimirEtiquetas(cantidad) {
  alert('Impresión de ' + cantidad + ' etiquetas (demo)');
}

function imprimirEtiquetasPersonalizado() {
  const cant = prompt('¿Cuántas etiquetas desea imprimir?');
  alert('Impresión personalizada de ' + cant + ' etiquetas (demo)');
}
