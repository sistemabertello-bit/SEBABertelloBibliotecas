// Módulo de gestión de usuarios
const db = require('../db/database');

function agregarUsuario(usuario) {
  const stmt = db.prepare(`INSERT INTO usuarios (
    id, dni, nombre, apellido, tipo, email, whatsapp, direccion, foto, estado, fechaAlta, historial
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  stmt.run(
    usuario.id, usuario.dni, usuario.nombre, usuario.apellido, usuario.tipo, usuario.contacto.email, usuario.contacto.whatsapp, usuario.contacto.direccion, usuario.foto, usuario.estado, usuario.fechaAlta, JSON.stringify(usuario.historial)
  );
}

function buscarUsuarioPorId(id) {
  return db.prepare('SELECT * FROM usuarios WHERE id = ?').get(id);
}

function listarUsuarios() {
  return db.prepare('SELECT * FROM usuarios').all();
}

module.exports = { agregarUsuario, buscarUsuarioPorId, listarUsuarios };
