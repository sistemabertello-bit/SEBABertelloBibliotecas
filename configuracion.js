// Módulo de configuración (demo)
let config = {
  canal: 'email',
  limite: 3
};
function guardarConfig(nueva) {
  config = { ...config, ...nueva };
}
function obtenerConfig() {
  return config;
}
module.exports = { guardarConfig, obtenerConfig };

let iaConfig = {
  motor: 'openai',
  clave: '',
  modo: 'búsqueda',
  sugerencias: true
};

function guardarIAConfig(nueva) {
  iaConfig = { ...iaConfig, ...nueva };
}
function obtenerIAConfig() {
  return iaConfig;
}
module.exports.guardarIAConfig = guardarIAConfig;
module.exports.obtenerIAConfig = obtenerIAConfig;
