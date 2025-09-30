// Módulo de reportes (demo)
const db = require('../db/database');

function prestamosPorPeriodo() {
  return db.prepare('SELECT * FROM prestamos').all();
}
function librosMasPrestados() {
  // Demo: solo listado
  return db.prepare('SELECT titulo, COUNT(*) as veces FROM libros GROUP BY titulo ORDER BY veces DESC LIMIT 10').all();
}
function usuariosActivos() {
  return db.prepare('SELECT * FROM usuarios WHERE estado = "activo"').all();
}

module.exports = { prestamosPorPeriodo, librosMasPrestados, usuariosActivos };
