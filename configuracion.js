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
