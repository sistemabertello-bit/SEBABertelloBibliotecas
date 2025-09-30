// app/patcher.js
const fetch = (...args) => import('node-fetch').then(({default: f})=>f(...args));
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { app } = require('electron');

async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to download: ' + res.status);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
}

async function downloadAndApplyPatch(url) {
  try {
    const tmp = app.getPath('temp');
    const zipPath = path.join(tmp, 'sebabiblio-patch.zip');
    await downloadFile(url, zipPath);
    const zip = new AdmZip(zipPath);
    const extractTo = path.join(app.getPath('userData'), 'patches', Date.now().toString());
    zip.extractAllTo(extractTo, true);
    console.log('Patch downloaded to', extractTo);
    return true;
  } catch (e) {
    console.error('Patch error', e);
    return false;
  }
}

module.exports = { downloadAndApplyPatch };
