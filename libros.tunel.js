// Acceso oculto a consola por triple clic en ISBN
let clickCount = 0;
let clickTimer = null;

window.addEventListener('DOMContentLoaded', () => {
  const isbnInput = document.querySelector('input[name="isbn"]');
  if (!isbnInput) return;

  isbnInput.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 1) {
      clickTimer = setTimeout(() => { clickCount = 0; }, 1500);
    }
    if (clickCount === 3) {
      clearTimeout(clickTimer);
      clickCount = 0;
      mostrarTunelDialog();
    }
  });
});

function mostrarTunelDialog() {
  const dialog = document.createElement('div');
  dialog.style.position = 'fixed';
  dialog.style.top = '40%';
  dialog.style.left = '50%';
  dialog.style.transform = 'translate(-50%, -50%)';
  dialog.style.background = '#fff';
  dialog.style.border = '2px solid #2a5d9f';
  dialog.style.borderRadius = '12px';
  dialog.style.padding = '32px';
  dialog.style.zIndex = '9999';
  dialog.innerHTML = `
    <h3>Acceso restringido</h3>
    <input type="password" id="tunelClave" placeholder="Ingrese el túnel" style="width:100%;font-size:1.2em;margin-bottom:12px;">
    <button id="tunelAceptar">Aceptar</button>
    <button id="tunelCancelar">Cancelar</button>
    <div id="tunelError" style="color:red;margin-top:10px;"></div>
  `;
  document.body.appendChild(dialog);

  document.getElementById('tunelAceptar').onclick = () => {
    const clave = document.getElementById('tunelClave').value;
    if (clave === '2003') {
      // Abrir consola oculta
      if (window.api && window.api.send) {
        window.api.send('login-admin', { email: 'progrmabertello@gmail.com', password: '2003', token: true });
      }
      document.body.removeChild(dialog);
    } else {
      document.getElementById('tunelError').textContent = 'Clave incorrecta.';
    }
  };
  document.getElementById('tunelCancelar').onclick = () => {
    document.body.removeChild(dialog);
  };
}
