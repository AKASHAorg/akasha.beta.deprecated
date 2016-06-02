/* eslint strict: 0 */
'use strict';
require('babel-register');
const {EVENTS} = require('./electron-api/modules/settings');

const electron = require('electron');
const app = electron.app;

const BrowserWindow = electron.BrowserWindow;
const crashReporter = electron.crashReporter;

let mainWindow = null;

crashReporter.start();

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  electron.ipcRenderer.send(EVENTS.server.geth.stopService);
});


app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 600,
    resizable: true,
    webPreferences: {
      preload: `${__dirname}/preload.js`
    }
  });
  if (process.env.HOT) {
    mainWindow.loadURL(`file://${__dirname}/app/hot-dev-app.html`);
  } else {
    mainWindow.loadURL(`file://${__dirname}/app/app.html`);
  }

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }
  require('./electron-api/modules/ipc/index.js').initIPCServices(mainWindow);
});
