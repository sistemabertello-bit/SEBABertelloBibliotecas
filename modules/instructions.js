const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { dialog, app } = require("electron");

// URL real del JSON de instrucciones en GitHub Pages
const INSTRUCTIONS_URL = "https://sistemabertello-bit.github.io/SEBABertelloBibliotecas/docs/instructions.json";
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
};
