// IPC para publicar instrucciones en GitHub Pages
ipcMain.handle('publicar-instrucciones', async (event, { contenido, token }) => {
  try {
    const { publicarInstrucciones } = require('./modules/instructions');
    const json = JSON.parse(contenido);
    await publicarInstrucciones(json, token);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

const { fetchInstructions, estaBloqueado } = require('./modules/instructions');


function createWindow(mode = "biblioteca") {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
  if (mode === "consola") {
    win.webContents.once('did-finish-load', () => {
      win.webContents.send('abrir-consola');
    });
  }
}


app.whenReady().then(async () => {
  // Descargar instrucciones al iniciar
  await fetchInstructions();

  // Enviar info de copia al servidor central al instalar/primera ejecución
  const fs = require('fs');
  const path = require('path');
  const infoPath = path.join(app.getPath('userData'), 'info-copia.json');
  let infoCopia = null;
  if (!fs.existsSync(infoPath)) {
    infoCopia = {};
    // Espera a que el frontend envíe los datos por IPC
  } else {
    infoCopia = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
  }
// IPC para recibir información de la copia instalada (formulario)
ipcMain.handle('info-copia', async (event, datos) => {
  const fs = require('fs');
  const path = require('path');
  const infoPath = path.join(app.getPath('userData'), 'info-copia.json');
  if (datos && datos.email && datos.empresa && datos.ip) {
    fs.writeFileSync(infoPath, JSON.stringify(datos, null, 2));
    // En producción: enviar a servidor central
    // await axios.post('https://tuservidorcentral.com/api/registro-copia', datos);
    return { success: true };
  } else if (fs.existsSync(infoPath)) {
    return { success: true };
  } else {
    return { success: false };
  }
});

  // Programar lectura diaria (cada 24h)
  setInterval(fetchInstructions, 24 * 60 * 60 * 1000);

  if (!estaBloqueado()) {
    createWindow("biblioteca");
  } else {
    dialog.showErrorBox('Acceso denegado', 'La app está bloqueada hasta cumplir las condiciones.');
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0 && !estaBloqueado()) createWindow("biblioteca");
  });
});

// IPC para módulo préstamos y devoluciones
const prestamos = require('./prestamos');
const libros = require('./libros');
const etiquetas = require('./etiquetas');
const usuarios = require('./usuarios');

ipcMain.handle('registrar-devolucion', async (event, { id, fecha }) => {
  prestamos.registrarDevolucion(id, fecha);
  return { success: true };
});

ipcMain.handle('aplicar-excepcion', async (event, { id, motivo }) => {
  prestamos.aplicarExcepcion(id, { motivo, fecha: new Date().toISOString() });
  return { success: true };
});

ipcMain.handle('historial-prestamos', async (event, { socioId }) => {
  const historial = prestamos.historialPrestamos(socioId);
  return { success: true, historial };
});

ipcMain.handle('reservar-libro', async (event, { id, socioId, inventario }) => {
  prestamos.reservarLibro({ id, socioId, inventario, fechaPrestamo: new Date().toISOString(), estado: 'reservado' });
  return { success: true };
});

ipcMain.handle('buscar-prestamos-avanzado', async (event, filtro) => {
  const resultados = prestamos.buscarPrestamosAvanzado(filtro);
  return { success: true, resultados };
});

// IPC para importar libros
ipcMain.handle('importar-libros', async (event, { archivo }) => {
  const resultado = libros.importarLibros(archivo);
  return { success: true, resultado };
});

// IPC para exportar libros
ipcMain.handle('exportar-libros', async (event) => {
  // Demo: exportar listado como JSON
  const lista = libros.listarLibros();
  return { success: true, datos: lista };
});

// IPC para acomodar libro
ipcMain.handle('acomodar-libro', async (event, { inventario, estanteria, anaquel, posicion }) => {
  const ubicacion = libros.acomodarLibro(inventario, estanteria, anaquel, posicion);
  return { success: true, ubicacion };
});

// IPC para generar código de barras de libro
ipcMain.handle('codigo-barra-libro', async (event, { inventario }) => {
  const codigo = libros.generarCodigoBarra(inventario);
  return { success: true, codigo };
});

// IPC para generar etiqueta de libro
ipcMain.handle('etiqueta-libro', async (event, { inventario }) => {
  const libro = libros.buscarLibroPorInventario(inventario);
  if (!libro) return { success: false, message: 'No encontrado' };
  const ubicacion = `E${libro.estanteria}-A${libro.anaquel}-P${libro.posicion}`;
  const etiqueta = etiquetas.generarEtiqueta(inventario, ubicacion, libro.clasificaciones || '');
  return { success: true, etiqueta };
});

// IPC para generar código de barras de usuario
ipcMain.handle('codigo-barra-usuario', async (event, { dni }) => {
  // Demo: código de barras = CB-usuario-DNI
  return { success: true, codigo: 'CB-U-' + dni };
});

// IPC para buscar libro por código de barras
ipcMain.handle('buscar-por-codigo-barra', async (event, { codigo }) => {
  const libro = libros.buscarPorCodigoBarra(codigo);
  return libro || {};
});

// IPC para login admin oculto
ipcMain.handle("login-admin", async (event, { email, password, token }) => {
  if (email === "progrmabertello@gmail.com" && password === "2003" && token) {
    createWindow("consola");
    return { success: true };
  }
  return { success: false, message: "Credenciales inválidas" };
});

// IPC para recibir información de la copia instalada
ipcMain.handle('info-copia', async (event, datos) => {
  // Guardar info localmente y/o enviarla al servidor central
  const fs = require('fs');
  const path = require('path');
  const infoPath = path.join(app.getPath('userData'), 'info-copia.json');
  fs.writeFileSync(infoPath, JSON.stringify(datos, null, 2));
  // En producción: enviar a servidor central
  // await axios.post('https://tuservidorcentral.com/api/registro-copia', datos);
  return { success: true };
});

// IPC para aplicar parche desde consola
ipcMain.handle('aplicar-parche', async (event, { url }) => {
  try {
    const { downloadAndApplyPatch } = require('./patcher');
    const ok = await downloadAndApplyPatch(url);
    return { success: ok };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
