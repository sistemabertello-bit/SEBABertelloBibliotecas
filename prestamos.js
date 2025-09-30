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

function registrarDevolucion(id, fechaDevolucionReal) {
  db.prepare('UPDATE prestamos SET fechaDevolucionReal = ?, estado = ? WHERE id = ?')
    .run(fechaDevolucionReal, 'devuelto', id);
}

function aplicarExcepcion(id, excepcion) {
  const prestamo = db.prepare('SELECT * FROM prestamos WHERE id = ?').get(id);
  let excepciones = [];
  if (prestamo && prestamo.excepciones) {
    try { excepciones = JSON.parse(prestamo.excepciones); } catch {}
  }
  excepciones.push(excepcion);
  db.prepare('UPDATE prestamos SET excepciones = ? WHERE id = ?')
    .run(JSON.stringify(excepciones), id);
}

function historialPrestamos(socioId) {
  return db.prepare('SELECT * FROM prestamos WHERE socioId = ?').all(socioId);
}

function reservarLibro(prestamo) {
  prestamo.estado = 'reservado';
  agregarPrestamo(prestamo);
}

function buscarPrestamosAvanzado(filtro) {
  // Filtro puede incluir inventario, ISBN, título, usuario, estado, fechas, etc.
  let query = 'SELECT * FROM prestamos WHERE 1=1';
  let params = [];
  if (filtro.inventario) { query += ' AND inventario = ?'; params.push(filtro.inventario); }
  if (filtro.socioId) { query += ' AND socioId = ?'; params.push(filtro.socioId); }
  if (filtro.estado) { query += ' AND estado = ?'; params.push(filtro.estado); }
  if (filtro.fechaDesde) { query += ' AND fechaPrestamo >= ?'; params.push(filtro.fechaDesde); }
  if (filtro.fechaHasta) { query += ' AND fechaPrestamo <= ?'; params.push(filtro.fechaHasta); }
  return db.prepare(query).all(...params);
}

function listarPrestamos() {
  return db.prepare('SELECT * FROM prestamos').all();
}

module.exports = {
  agregarPrestamo,
  listarPrestamos,
  registrarDevolucion,
  aplicarExcepcion,
  historialPrestamos,
  reservarLibro,
  buscarPrestamosAvanzado
};
