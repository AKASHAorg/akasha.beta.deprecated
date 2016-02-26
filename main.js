/* eslint strict: 0 */
'use strict';
require('babel-register');

const electron = require('electron');
const api = require('./electron-api');
const linvoDb = require('linvodb3');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const userData = 'userData';
const crashReporter = electron.crashReporter;

let mainWindow = null;
let timeout;
let ipcMain;

linvoDb.dbPath = app.getPath(userData);

crashReporter.start();

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 500, height: 700, resizable: false });
   timeout = setTimeout(()=>{
     ipcMain = api(mainWindow);
  }, 100);

  if (process.env.HOT) {
    mainWindow.loadURL(`file://${__dirname}/app/hot-dev-app.html`);
  } else {
    mainWindow.loadURL(`file://${__dirname}/app/app.html`);
  }

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }
});
