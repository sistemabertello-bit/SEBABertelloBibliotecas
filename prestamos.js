// Módulo de gestión de préstamos
const db = require('../db/database');

function agregarPrestamo(prestamo) {
  const stmt = db.prepare(`INSERT INTO prestamos (
    id, socioId, inventario, fechaPrestamo, fechaDevolucionPrevista, fechaDevolucionReal, estado, notas, excepciones
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  stmt.run(
    prestamo.id, prestamo.socioId, prestamo.inventario, prestamo.fechaPrestamo, prestamo.fechaDevolucionPrevista, prestamo.fechaDevolucionReal, prestamo.estado, prestamo.notas, JSON.stringify(prestamo.excepciones)
  );
}

function listarPrestamos() {
  return db.prepare('SELECT * FROM prestamos').all();
}

module.exports = { agregarPrestamo, listarPrestamos };
