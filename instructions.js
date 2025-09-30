// app/instructions.js
const fetch = (...args) => import('node-fetch').then(({default: f})=>f(...args));
const { downloadAndApplyPatch } = require('./patcher');
const INSTRUCTIONS_URL = "https://sebastianbertello-gif.github.io/BibliotecaBERTELLO-SEBASTIAN/instructions.json";

async function fetchInstructions() {
  try {
    const res = await fetch(INSTRUCTIONS_URL, { cache: "no-store" });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    return json;
  } catch (e) {
    console.error('Error fetching instructions:', e.message);
    return null;
  }
}

async function executeInstructions(json) {
  if (!json || !Array.isArray(json.instrucciones)) return;
  for (const instr of json.instrucciones) {
    switch (instr.accion) {
      case 'mensaje':
        global.showModal && global.showModal('Aviso', instr.texto || '');
        break;
      case 'bloquear':
        global.lockApp && global.lockApp(instr.motivo || 'Bloqueado por administrador');
        break;
      case 'desbloquear':
        global.unlockApp && global.unlockApp();
        break;
      case 'parche':
        if (instr.url) {
          // Aplicar el parche automáticamente, sin preguntar
          await downloadAndApplyPatch(instr.url);
          // Opcional: notificar al usuario que la app se actualizará y debe reiniciarse
          if (global.showModal) {
            global.showModal('Actualización', 'La aplicación se está actualizando. Por favor, reinicie la app para completar la actualización.');
          }
        }
        break;
      case 'config':
        global.applyConfig && global.applyConfig(instr.key, instr.value);
        break;
      default:
        console.warn('Instrucción desconocida:', instr);
    }
  }
}

function scheduleChecks(intervalHours = 12) {
  fetchInstructions().then(executeInstructions);
  setInterval(async () => {
    const j = await fetchInstructions();
    await executeInstructions(j);
  }, intervalHours * 60 * 60 * 1000);
}

module.exports = { fetchInstructions, executeInstructions, scheduleChecks };
