// Navegación básica entre módulos
// Este archivo puede expandirse para lógica de permisos y roles

// Permisos de operador
function obtenerOperadorActual() {
  const op = localStorage.getItem('operadorActual');
  return op ? JSON.parse(op) : null;
}

function tienePermiso(permiso) {
  const operador = obtenerOperadorActual();
  if (!operador) return false;
  return operador.permisos.includes('total') || operador.permisos.includes(permiso);
}

window.onload = function() {
	const reg = localStorage.getItem('registro');
	if (!reg) {
		window.location.href = 'registro.html';
	} else {
		const datos = JSON.parse(reg);
		if (!datos.acepto) {
			window.location.href = 'registro.html';
		}
		// Si no tiene permiso de libros, ocultar botón
		if (!tienePermiso('libros')) {
			const btnLibros = document.getElementById('btnLibros');
			if (btnLibros) btnLibros.style.display = 'none';
		}
		// Repetir para otros módulos: prestamos, usuarios, etc.
	}
};
