// app/backup.js
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { app } = require('electron');

function createBackup(destPath) {
  const dbFolder = path.join(app.getPath('userData'), 'db');
  const zip = new AdmZip();
  zip.addLocalFolder(dbFolder);
  zip.writeZip(destPath);
}

function restoreBackup(zipPath) {
  const extractTo = path.join(app.getPath('userData'), 'restore_temp');
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(extractTo, true);
}

module.exports = { createBackup, restoreBackup };
