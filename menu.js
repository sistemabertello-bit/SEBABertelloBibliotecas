// Navegación básica entre módulos
// Este archivo puede expandirse para lógica de permisos y roles

window.onload = function() {
	const reg = localStorage.getItem('registro');
	if (!reg) {
		window.location.href = 'registro.html';
	} else {
		const datos = JSON.parse(reg);
		if (!datos.acepto) {
			window.location.href = 'registro.html';
		}
	}
};
