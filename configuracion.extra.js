// Búsqueda real por cámara usando Quagga en configuración
function buscarPorCamaraConfig() {
  const dialog = document.getElementById('camaraDialogConfig');
  dialog.style.display = 'block';
  document.getElementById('resultadoCamaraConfig').innerText = 'Escaneando...';
  if (!window.Quagga) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/quagga@0.12.1/dist/quagga.min.js';
    script.onload = iniciarQuaggaConfig;
    document.body.appendChild(script);
  } else {
    iniciarQuaggaConfig();
  }
}

function iniciarQuaggaConfig() {
  window.Quagga.init({
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: document.querySelector('#videoCamaraConfig'),
      constraints: { width: 400, height: 200, facingMode: 'environment' }
    },
    decoder: { readers: ['code_128_reader', 'ean_reader', 'ean_8_reader'] }
  }, function(err) {
    if (err) {
      document.getElementById('resultadoCamaraConfig').innerText = 'Error: ' + err;
      return;
    }
    window.Quagga.start();
  });
  window.Quagga.onDetected(function(result) {
    const codigo = result.codeResult.code;
    document.getElementById('resultadoCamaraConfig').innerText = 'Código detectado: ' + codigo;
    window.Quagga.stop();
    alert('Código de configuración detectado: ' + codigo);
  });
}

function cerrarCamaraConfig() {
  const dialog = document.getElementById('camaraDialogConfig');
  dialog.style.display = 'none';
  if (window.Quagga) window.Quagga.stop();
}

let operadores = [
  {
    id: 1,
    nombre: 'Operador Principal',
    usuario: 'admin',
    clave: 'admin123',
    permisos: ['total']
  }
];

function mostrarDialogoRoles() {
  const dialog = document.getElementById('dialogConfig');
  dialog.style.display = 'block';
  dialog.innerHTML = [
    '<h3>Gestión de Operadores y Permisos</h3>',
    '<table border="1" style="width:100%;text-align:left;"><tr><th>Nombre</th><th>Usuario</th><th>Permisos</th><th>Acciones</th></tr>',
    operadores.map(op => `<tr><td>${op.nombre}</td><td>${op.usuario}</td><td>${op.permisos.join(', ')}</td><td><button onclick="editarOperador(${op.id})">Editar</button><button onclick="eliminarOperador(${op.id})">Eliminar</button></td></tr>`).join(''),
    '</table>',
    '<button onclick="nuevoOperador()">Nuevo Operador</button>',
    '<button onclick="cerrarDialogoRoles()">Cerrar</button>'
  ].join('');
}

function gestionarRoles() {
  mostrarDialogoRoles();
}

function cerrarDialogoRoles() {
  document.getElementById('dialogConfig').style.display = 'none';
}

function nuevoOperador() {
  const nombre = prompt('Nombre del operador:');
  const usuario = prompt('Usuario:');
  const clave = prompt('Clave:');
  const permisos = prompt('Permisos (separados por coma, ej: prestamos,libros,usuarios):');
  if (nombre && usuario && clave) {
    operadores.push({
      id: Date.now(),
      nombre,
      usuario,
      clave,
      permisos: permisos ? permisos.split(',').map(p => p.trim()) : []
    });
    mostrarDialogoRoles();
  }
}

function editarOperador(id) {
  const op = operadores.find(o => o.id === id);
  if (!op) return;
  const nombre = prompt('Nombre:', op.nombre);
  const usuario = prompt('Usuario:', op.usuario);
  const clave = prompt('Clave:', op.clave);
  const permisos = prompt('Permisos:', op.permisos.join(', '));
  if (nombre && usuario && clave) {
    op.nombre = nombre;
    op.usuario = usuario;
    op.clave = clave;
    op.permisos = permisos ? permisos.split(',').map(p => p.trim()) : [];
    mostrarDialogoRoles();
  }
}

function eliminarOperador(id) {
  operadores = operadores.filter(o => o.id !== id);
  mostrarDialogoRoles();
}

// Funciones JS para los nuevos botones en configuracion.html
function gestionarRoles() {
  alert('Gestión de roles y permisos (demo)');
}

function configurarCamposObligatorios() {
  alert('Configuración de campos obligatorios (demo)');
}

function configurarEstanterias() {
  alert('Configuración de estanterías y salas (demo)');
}

function configurarPoliticasPrestamo() {
  alert('Configuración de políticas de préstamo (demo)');
}

function configurarNumeracionInventario() {
  alert('Configuración de numeración de inventario (demo)');
}

function configurarIA() {
  alert('Configuración de IA (demo)');
}

function verAuditoria() {
  alert('Auditoría del sistema (demo)');
}
