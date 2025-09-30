
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { fetchInstructions, estaBloqueado } = require('./modules/instructions');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200, height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(async () => {
  // Descargar instrucciones al iniciar
  await fetchInstructions();

  // Programar lectura diaria (cada 24h)
  setInterval(fetchInstructions, 24 * 60 * 60 * 1000);

  if (!estaBloqueado()) {
    createWindow();
  } else {
    dialog.showErrorBox('Acceso denegado', 'La app está bloqueada hasta cumplir las condiciones.');
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0 && !estaBloqueado()) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
