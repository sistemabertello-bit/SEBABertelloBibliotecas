// Búsqueda real por cámara usando Quagga en usuarios
function buscarPorCamaraUsuario() {
  const dialog = document.getElementById('camaraDialogUsuario');
  dialog.style.display = 'block';
  document.getElementById('resultadoCamaraUsuario').innerText = 'Escaneando...';
  if (!window.Quagga) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/quagga@0.12.1/dist/quagga.min.js';
    script.onload = iniciarQuaggaUsuario;
    document.body.appendChild(script);
  } else {
    iniciarQuaggaUsuario();
  }
}

function iniciarQuaggaUsuario() {
  window.Quagga.init({
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: document.querySelector('#videoCamaraUsuario'),
      constraints: { width: 400, height: 200, facingMode: 'environment' }
    },
    decoder: { readers: ['code_128_reader', 'ean_reader', 'ean_8_reader'] }
  }, function(err) {
    if (err) {
      document.getElementById('resultadoCamaraUsuario').innerText = 'Error: ' + err;
      return;
    }
    window.Quagga.start();
  });
  window.Quagga.onDetected(function(result) {
    const codigo = result.codeResult.code;
    document.getElementById('resultadoCamaraUsuario').innerText = 'Código detectado: ' + codigo;
    window.Quagga.stop();
    // Aquí podrías buscar usuario por código
    alert('Código de usuario detectado: ' + codigo);
  });
}

function cerrarCamaraUsuario() {
  const dialog = document.getElementById('camaraDialogUsuario');
  dialog.style.display = 'none';
  if (window.Quagga) window.Quagga.stop();
}
// Funciones JS para los nuevos botones en usuarios.html
function importarUsuarios() {
  const dialog = document.getElementById('importacionUsuariosDialog');
  dialog.style.display = 'block';
  dialog.innerHTML = `<h3>Importar Usuarios</h3>
    <input type='file' id='archivoImportarUsuarios'>
    <button onclick='procesarImportacionUsuarios()'>Procesar</button>
    <button onclick='cerrarImportacionUsuarios()'>Cancelar</button>`;
}

function procesarImportacionUsuarios() {
  const archivo = document.getElementById('archivoImportarUsuarios').files[0];
  alert('Importación simulada: ' + (archivo ? archivo.name : 'Ningún archivo seleccionado'));
  cerrarImportacionUsuarios();
}

function cerrarImportacionUsuarios() {
  document.getElementById('importacionUsuariosDialog').style.display = 'none';
}

function buscarPorVoz() {
  alert('Función de búsqueda por voz (demo)');
}

function buscarPorArchivo() {
  alert('Función de búsqueda por archivo (demo)');
}
