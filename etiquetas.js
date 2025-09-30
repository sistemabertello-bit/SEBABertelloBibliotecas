const bwipjs = require('bwip-js'); // Generador de código de barras

// Módulo de etiquetas y códigos de barras (demo)
function generarEtiqueta(inventario, ubicacion, signatura) {
  return `Etiqueta: ${inventario} | ${ubicacion} | ${signatura}`;
}

function generarCodigoBarra(inventario) {
  // Genera imagen PNG base64 de código de barras
  try {
    const png = bwipjs.toBuffer({
      bcid:        'code128',
      text:        inventario,
      scale:       3,
      height:      10,
      includetext: true,
      textxalign:  'center',
    });
    return 'data:image/png;base64,' + png.toString('base64');
  } catch (e) {
    return null;
  }
}

function imprimirEtiqueta(etiqueta, codigoBarraImg) {
  // Lógica de impresión real (demo: abre ventana)
  const win = window.open('', 'Etiqueta', 'width=400,height=200');
  win.document.write(`<h3>Etiqueta</h3><p>${etiqueta}</p><img src='${codigoBarraImg}'><br><button onclick='window.print()'>Imprimir</button>`);
}

module.exports = { generarEtiqueta, generarCodigoBarra, imprimirEtiqueta };
