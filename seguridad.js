// Módulo de seguridad y permisos (demo)
let roles = {
  operadorPrincipal: {
    permisos: ['configurar', 'importar', 'gestionar', 'auditar', 'mensajeria', 'reportes', 'respaldo', 'ia']
  },
  suboperador: {
    permisos: ['gestionar', 'mensajeria', 'reportes']
  },
  lector: {
    permisos: ['mensajeria']
  }
};
function obtenerPermisos(rol) {
  return roles[rol]?.permisos || [];
}
module.exports = { obtenerPermisos };
