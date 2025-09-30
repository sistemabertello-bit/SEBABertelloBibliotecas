// Conexión frontend para módulo préstamos y devoluciones
function registrarDevolucion() {
  const id = document.querySelector('input[name="id"]').value;
  const fecha = new Date().toISOString().slice(0,10);
  if (window.api && window.api.send) {
    window.api.send('registrar-devolucion', { id, fecha });
  }
  alert('Devolución registrada (demo) para préstamo ' + id);
}

function aplicarExcepcion() {
  const id = document.querySelector('input[name="id"]').value;
  const motivo = prompt('Motivo de la excepción:');
  if (window.api && window.api.send) {
    window.api.send('aplicar-excepcion', { id, motivo });
  }
  alert('Excepción aplicada (demo) para préstamo ' + id);
}

function verHistorialPrestamos() {
  const socioId = document.querySelector('input[name="socioId"]').value;
  if (window.api && window.api.send) {
    window.api.send('historial-prestamos', { socioId });
  }
  alert('Historial de préstamos (demo) para usuario ' + socioId);
}

function reservarLibro() {
  const id = document.querySelector('input[name="id"]').value;
  const socioId = document.querySelector('input[name="socioId"]').value;
  const inventario = document.querySelector('input[name="inventario"]').value;
  if (window.api && window.api.send) {
    window.api.send('reservar-libro', { id, socioId, inventario });
  }
  alert('Libro reservado (demo) para usuario ' + socioId);
}

function buscarPrestamosAvanzado() {
  const filtro = {
    inventario: document.querySelector('input[name="inventario"]').value,
    socioId: document.querySelector('input[name="socioId"]').value,
    estado: document.querySelector('input[name="estado"]') ? document.querySelector('input[name="estado"]').value : '',
    fechaDesde: document.querySelector('input[name="fechaDesde"]') ? document.querySelector('input[name="fechaDesde"]').value : '',
    fechaHasta: document.querySelector('input[name="fechaHasta"]') ? document.querySelector('input[name="fechaHasta"]').value : ''
  };
  if (window.api && window.api.send) {
    window.api.send('buscar-prestamos-avanzado', filtro);
  }
  alert('Búsqueda avanzada de préstamos (demo)');
}
