
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
  if (mode === "biblioteca") {
    win.loadFile(path.join(__dirname, 'index.html'));
  } else if (mode === "consola") {
    win.loadFile(path.join(__dirname, 'consola.html'));
  }
}


app.whenReady().then(async () => {
  // Descargar instrucciones al iniciar
  await fetchInstructions();

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

// IPC para login admin oculto
ipcMain.handle("login-admin", async (event, { email, password, token }) => {
  if (email === "progrmabertello@gmail.com" && password === "2003" && token) {
    createWindow("consola");
    return { success: true };
  }
  return { success: false, message: "Credenciales inválidas" };
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
