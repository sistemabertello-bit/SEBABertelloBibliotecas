const db = require('../db/database');

// Modelo de Auditoría/Log
module.exports = class Auditoria {
  constructor({ usuario, accion, fecha, modulo, detalles }) {
    this.usuario = usuario;
    this.accion = accion;
    this.fecha = fecha;
    this.modulo = modulo;
    this.detalles = detalles;
  }
}

function registrarAccion(auditoria) {
  const stmt = db.prepare(`INSERT INTO auditoria (
    usuario, accion, fecha, modulo, detalles
  ) VALUES (?, ?, ?, ?, ?)`);
  stmt.run(
    auditoria.usuario,
    auditoria.accion,
    auditoria.fecha,
    auditoria.modulo,
    JSON.stringify(auditoria.detalles)
  );
}

function consultarAuditoria(filtro) {
  let query = 'SELECT * FROM auditoria WHERE 1=1';
  let params = [];
  if (filtro.usuario) { query += ' AND usuario = ?'; params.push(filtro.usuario); }
  if (filtro.modulo) { query += ' AND modulo = ?'; params.push(filtro.modulo); }
  if (filtro.fechaDesde) { query += ' AND fecha >= ?'; params.push(filtro.fechaDesde); }
  if (filtro.fechaHasta) { query += ' AND fecha <= ?'; params.push(filtro.fechaHasta); }
  return db.prepare(query).all(...params);
}

module.exports.registrarAccion = registrarAccion;
module.exports.consultarAuditoria = consultarAuditoria;
