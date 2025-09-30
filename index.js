// Cuadro fijo de mensajes para operadores
let mensajesFijos = [];
function mostrarMensajeFijo(texto) {
  if (texto) {
    mensajesFijos.unshift({ texto, fecha: new Date().toLocaleString() });
    if (mensajesFijos.length > 5) mensajesFijos = mensajesFijos.slice(0, 5);
    localStorage.setItem('mensajesFijos', JSON.stringify(mensajesFijos));
  } else {
    const guardados = localStorage.getItem('mensajesFijos');
    mensajesFijos = guardados ? JSON.parse(guardados) : [];
  }
  document.getElementById('textoMensajeFijo').textContent = mensajesFijos[0]?.texto || 'SebaBiblio';
  document.getElementById('historialMensajes').innerHTML = mensajesFijos.slice(1).map(m => `<div style='border-top:1px solid #eee;padding:2px 0;'>${m.texto}<br><span style='font-size:11px;color:#888;'>${m.fecha}</span></div>`).join('');
}

// Escuchar mensajes desde backend (instrucciones)
if (window.api && window.api.on) {
  window.api.on('mensaje-operador', (msg) => {
    mostrarMensajeFijo(msg);
  });
}

// Al iniciar, mostrar nombre si no hay mensaje
window.addEventListener('DOMContentLoaded', () => {
  mostrarMensajeFijo();
});
// Acceso solo por flujo oculto (triple clic y clave túnel)
const INSTRUCTIONS_PATH = "../../instructions.json";

// Registro de copia instalada en primera ejecución
window.addEventListener('DOMContentLoaded', () => {
  if (window.api) {
    window.api.send('info-copia').then(res => {
      // Si no existe info, mostrar formulario
      fetch('info-copia.json').then(r => r.json()).then(data => {
        if (!data || !data.email || !data.empresa || !data.ip) {
          document.getElementById('registroCopiaDialog').style.display = 'block';
        }
      }).catch(() => {
        document.getElementById('registroCopiaDialog').style.display = 'block';
      });
    });
  }
});

document.getElementById('formRegistroCopia')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('emailCopia').value;
  const empresa = document.getElementById('empresaCopia').value;
  const ip = document.getElementById('ipCopia').value;
  if (window.api) {
    window.api.send('info-copia', { email, empresa, ip, estado: 'activo', id: Date.now().toString() }).then(res => {
      document.getElementById('resultadoRegistroCopia').textContent = 'Registro exitoso.';
      document.getElementById('registroCopiaDialog').style.display = 'none';
    });
  }
});

if (window.api && window.api.on) {
  window.api.on('abrir-consola', () => {
    document.getElementById('consola').innerHTML = [
      '<h2>Consola de Administración de Copias</h2>',
      '<input type="text" id="busqueda" placeholder="Buscar por email, IP o empresa...">',
      '<button onclick="buscarCopias()">Buscar</button>',
      '<button onclick="actualizarCopias()">Actualizar</button>',
      '<div id="copias"></div>',
      '<div id="accionesGlobales">',
        '<button onclick="instruccionGlobal(\'mensaje\')">Mandar mensaje a todas</button>',
        '<button onclick="instruccionGlobal(\'bloquear\')">Bloquear todas</button>',
        '<button onclick="instruccionGlobal(\'habilitar\')">Habilitar todas</button>',
        '<button onclick="enviarParcheGlobal()">Enviar parche a todas</button>',
        '<button id="btnTokenGithub">Configurar publicación GitHub</button>',
      '</div>',
      '<div id="editorMensaje" style="display:none;">',
        '<textarea id="mensajeGlobal" rows="4" cols="50">En 30 días se bloqueará el sistema.</textarea><br>',
        '<button onclick="enviarMensajeGlobal()">Enviar mensaje</button>',
        '<button onclick="cerrarEditorMensaje()">Cancelar</button>',
      '</div>',
      '<h2>Editor de instrucciones</h2>',
      '<textarea id="editor" rows="8" cols="80"></textarea><br>',
      '<button id="publicar">Publicar instrucciones</button>',
      '<div id="resultado"></div>'
    ].join('');
    document.getElementById('consola').style.display = 'block';
    setTimeout(() => {
      document.getElementById('btnTokenGithub').onclick = guiarTokenGithub;
    }, 100);
    cargarCopias();
    cargarInstrucciones();
  });
}

function guiarTokenGithub() {
  const pasos = [
    '<h3>Generar y configurar token de GitHub</h3>',
    '<ol>',
    '  <li>Ingresa a <a href="https://github.com/settings/tokens" target="_blank">github.com/settings/tokens</a> con la cuenta <b>sistemabertello-bit</b>.</li>',
    '  <li>Haz clic en "Generate new token" (Classic).</li>',
    '  <li>Selecciona permisos: <b>repo</b> (acceso completo a repositorios).</li>',
    '  <li>Guarda el token generado en un lugar seguro.</li>',
    '  <li>En la consola, al publicar instrucciones, pega el token cuando se solicite.</li>',
    '</ol>',
    '<p>¡Listo! Ahora puedes publicar instrucciones y parches desde la consola usando GitHub Pages.</p>'
  ].join('');
  const dialog = document.createElement('div');
  dialog.innerHTML = pasos + '<button onclick="this.parentNode.remove()">Cerrar</button>';
  dialog.style = 'position:fixed;top:60px;right:20px;background:#fff;border:2px solid #333;padding:18px;z-index:9999;max-width:400px;box-shadow:2px 2px 12px #aaa;';
  document.body.appendChild(dialog);
}

// Simulación de copias registradas (en producción, obtener del servidor)
let copias = [];

function cargarCopias() {
  // Demo: leer copias locales (en producción, obtener del servidor)
  fetch('info-copia.json')
    .then(res => res.json())
    .then(data => {
      copias = [data];
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

document.getElementById('publicar').addEventListener('click', async function() {
  const contenido = document.getElementById('editor').value;
  const token = prompt('Ingrese su token personal de GitHub para publicar instrucciones:');
  if (!token) return;
  if (window.api) {
    window.api.send('publicar-instrucciones', { contenido, token }).then(res => {
      if (res.success) {
        document.getElementById('resultado').textContent = 'Instrucciones publicadas correctamente en GitHub Pages.';
      } else {
        document.getElementById('resultado').textContent = 'Error al publicar instrucciones: ' + (res.error || '');
      }
    });
  }
});
