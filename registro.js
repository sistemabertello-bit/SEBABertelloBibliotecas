// registro.js
// Lógica de registro y aceptación de términos

function getIP() {
  // Intento de obtener IP local (solo para ejemplo, en producción usar backend o servicio externo)
  return fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(data => data.ip)
    .catch(() => 'desconocida');
}

async function enviarRegistro(email, empresa, ip) {
  // Enviar datos al servidor central (ajustar URL real)
  const payload = { email, empresa, ip };
  try {
    await fetch('https://tuservidorcentral.com/api/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return true;
  } catch (e) {
    return false;
  }
}

document.getElementById('formRegistro').onsubmit = async function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const empresa = document.getElementById('empresa').value;
  const acepto = document.getElementById('acepto').checked;
  const mensaje = document.getElementById('mensaje');
  if (!acepto) {
    mensaje.textContent = 'Debe aceptar los términos para continuar.';
    return;
  }
  mensaje.textContent = 'Registrando...';
  const ip = await getIP();
  const ok = await enviarRegistro(email, empresa, ip);
  if (ok) {
    localStorage.setItem('registro', JSON.stringify({ email, empresa, ip, acepto: true }));
    window.location.href = 'menu.html';
  } else {
    mensaje.textContent = 'No se pudo registrar. Verifique su conexión.';
  }
};

document.getElementById('noAcepto').onclick = function() {
  document.getElementById('mensaje').textContent = 'No puede usar el sistema sin aceptar los términos.';
};

// Si ya está registrado y aceptó, redirigir al menú
window.onload = function() {
  const reg = localStorage.getItem('registro');
  if (reg) {
    const datos = JSON.parse(reg);
    if (datos.acepto) {
      window.location.href = 'menu.html';
    }
  }
};
