// Módulo de gestión de ubicación física (E-A-P)
function generarCodigoUbicacion(estanteria, anaquel, posicion) {
  return `E${estanteria}-A${anaquel}-P${posicion}`;
}
module.exports = { generarCodigoUbicacion };
