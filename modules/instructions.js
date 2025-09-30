const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { dialog, app } = require("electron");

// URL real del JSON de instrucciones en GitHub Pages
const INSTRUCTIONS_URL = "https://sistemabertello-bit.github.io/SEBABertelloBibliotecas/docs/instructions.json";

/**
 * Publica instrucciones en GitHub Pages (actualiza el archivo JSON)
 * Solo para consola admin (requiere token de GitHub)
 */
async function publicarInstrucciones(nuevasInstrucciones, token) {
  const axios = require('axios');
  // Obtener SHA actual del archivo
  const repo = "sistemabertello-bit/SEBABertelloBibliotecas";
  const path = "docs/instructions.json";
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
  let sha;
  try {
    const getRes = await axios.get(apiUrl, {
      headers: { Authorization: `token ${token}` }
    });
    sha = getRes.data.sha;
  } catch (err) {
    throw new Error('Token inválido o sin permisos. Verifica el token y los permisos repo.');
  }
  // Actualizar archivo
  try {
    await axios.put(apiUrl, {
      message: "Actualizar instrucciones desde consola",
      content: Buffer.from(JSON.stringify(nuevasInstrucciones, null, 2)).toString('base64'),
      sha
    }, {
      headers: { Authorization: `token ${token}` }
    });
    return true;
  } catch (err) {
    throw new Error('Error al publicar instrucciones: ' + (err.response?.data?.message || err.message));
  }
}
const LOCAL_COPY = path.join(app.getPath("userData"), "instructions.json");

let bloqueado = false;

/**
 * Descarga las instrucciones desde GitHub Pages
 */
async function fetchInstructions() {
  try {
    const response = await axios.get(INSTRUCTIONS_URL, { timeout: 10000 });
    const data = response.data;

    // Guardar copia local
    fs.writeFileSync(LOCAL_COPY, JSON.stringify(data, null, 2));

    aplicarInstrucciones(data);
  } catch (error) {
    console.error("Error al descargar instrucciones:", error.message);

    // Usar copia local si existe
    if (fs.existsSync(LOCAL_COPY)) {
      const data = JSON.parse(fs.readFileSync(LOCAL_COPY, "utf-8"));
      aplicarInstrucciones(data);
    }
  }
}

/**
 * Ejecuta las instrucciones recibidas
 */
function aplicarInstrucciones(data) {
  if (!data || !data.instrucciones) return;

  data.instrucciones.forEach((inst) => {
    switch (inst.accion) {
      case "mensaje":
        dialog.showMessageBoxSync({
          type: "info",
          title: "Aviso del Administrador",
          message: inst.texto,
        });
        // Enviar mensaje a renderer para mostrar en cuadro fijo
        const { BrowserWindow } = require("electron");
        BrowserWindow.getAllWindows().forEach(win => {
          win.webContents.send("mensaje-operador", inst.texto);
        });
        break;

      case "bloquear":
        if (inst.condicion && inst.condicion.contribucion_pendiente) {
          bloqueado = true;
          dialog.showErrorBox("Sistema bloqueado", inst.mensaje);
        }
        break;


      case "parche":
        dialog.showMessageBoxSync({
          type: "info",
          title: "Actualización disponible",
          message: `Se detectó un parche: ${inst.descripcion}\nURL: ${inst.url}`,
        });
        // Descargar y aplicar el parche automáticamente
        try {
          const { downloadAndApplyPatch } = require("../patcher");
          downloadAndApplyPatch(inst.url).then((ok) => {
            if (ok) {
              dialog.showMessageBoxSync({
                type: "info",
                title: "Parche aplicado",
                message: "El parche se descargó y aplicó correctamente. Reinicie la aplicación si es necesario.",
              });
            } else {
              dialog.showErrorBox("Error de parche", "No se pudo aplicar el parche automáticamente.");
            }
          });
        } catch (err) {
          dialog.showErrorBox("Error de parche", "No se pudo descargar/aplicar el parche: " + err.message);
        }
        break;

      default:
        console.log("Acción desconocida:", inst.accion);
    }
  });
}

/**
 * Revisa si el sistema está bloqueado
 */
function estaBloqueado() {
  return bloqueado;
}

module.exports = {
  fetchInstructions,
  estaBloqueado,
  publicarInstrucciones,
};
