// Login y lógica de consola de administración
const USUARIO = "progrmabertello@gmail.com";
const CLAVE = "2003";
const INSTRUCTIONS_PATH = "../../instructions.json";

document.getElementById('formLogin').addEventListener('submit', function(e) {
  e.preventDefault();
  const usuario = e.target.usuario.value;
  const clave = e.target.clave.value;
  if (usuario === USUARIO && clave === CLAVE) {
    document.getElementById('login').style.display = 'none';
    document.getElementById('consola').style.display = 'block';
    cargarCopias();
    cargarInstrucciones();
  } else {
    alert('Credenciales incorrectas');
  }
});

// Simulación de copias registradas (en producción, obtener del servidor)
let copias = [];

function cargarCopias() {
  fetch('https://tuservidorcentral.com/api/copias')
    .then(res => res.json())
    .then(data => {
      copias = data;
      mostrarCopias(copias);
    })
    .catch(() => {
      copias = [];
      mostrarCopias([]);
    });
}

function mostrarCopias(lista) {
  const div = document.getElementById('copias');
  if (!lista.length) {
    div.innerHTML = '<p>No hay copias registradas.</p>';
    return;
  }
  let html = '<table border="1" style="width:100%;text-align:left;"><tr><th>IP</th><th>Empresa/Institución</th><th>Email</th><th>Estado</th><th>Acciones</th></tr>';
  lista.forEach(copia => {
    html += `<tr>
      <td>${copia.ip}</td>
      <td>${copia.empresa}</td>
      <td>${copia.email}</td>
      <td>${copia.estado}</td>
      <td>
        <button onclick="bloquearCopia('${copia.id}')">Bloquear</button>
        <button onclick="habilitarCopia('${copia.id}')">Habilitar</button>
        <button onclick="editorMensaje('${copia.id}')">Mensaje</button>
      </td>
    </tr>`;
  });
  html += '</table>';
  div.innerHTML = html;
}

function buscarCopias() {
  const q = document.getElementById('busqueda').value.toLowerCase();
  const filtradas = copias.filter(c =>
    c.email.toLowerCase().includes(q) ||
    c.empresa.toLowerCase().includes(q) ||
    c.ip.toLowerCase().includes(q)
  );
  mostrarCopias(filtradas);
}

function actualizarCopias() {
  cargarCopias();
}

function bloquearCopia(id) {
  fetch(`https://tuservidorcentral.com/api/instruccion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, accion: 'bloquear' })
  });
  alert('Instrucción de bloqueo enviada.');
}

function habilitarCopia(id) {
  fetch(`https://tuservidorcentral.com/api/instruccion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, accion: 'habilitar' })
  });
  alert('Instrucción de habilitación enviada.');
}

let copiaMensajeId = null;
function editorMensaje(id) {
  copiaMensajeId = id;
  document.getElementById('editorMensaje').style.display = 'block';
}
function enviarMensajeGlobal() {
  const mensaje = document.getElementById('mensajeGlobal').value;
  if (copiaMensajeId) {
    fetch(`https://tuservidorcentral.com/api/instruccion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: copiaMensajeId, accion: 'mensaje', mensaje })
    });
    alert('Mensaje enviado a la copia seleccionada.');
  } else {
    // Global
    fetch(`https://tuservidorcentral.com/api/instruccion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'mensaje', mensaje })
    });
    alert('Mensaje enviado a todas las copias.');
  }
  cerrarEditorMensaje();
}
function cerrarEditorMensaje() {
  copiaMensajeId = null;
  document.getElementById('editorMensaje').style.display = 'none';
}

function instruccionGlobal(accion) {
  if (accion === 'mensaje') {
    copiaMensajeId = null;
    document.getElementById('editorMensaje').style.display = 'block';
  } else {
    fetch(`https://tuservidorcentral.com/api/instruccion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion })
    });
    alert('Instrucción enviada a todas las copias.');
  }
}

function cargarInstrucciones() {
  fetch(INSTRUCTIONS_PATH)
    .then(res => res.text())
    .then(txt => {
      document.getElementById('editor').value = txt;
    });
}

document.getElementById('publicar').addEventListener('click', function() {
  const contenido = document.getElementById('editor').value;
  // Guardar instrucciones (simulado)
  fetch(INSTRUCTIONS_PATH, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: contenido
  }).then(() => {
    document.getElementById('resultado').textContent = 'Instrucciones publicadas correctamente.';
  }).catch(() => {
    document.getElementById('resultado').textContent = 'Error al publicar instrucciones.';
  });
});
