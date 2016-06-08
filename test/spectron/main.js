/* eslint strict: 0 */
'use strict';
require('babel-register');
const gethService = require('../../electron-api/modules/services/geth');
const ipfsService = require('../../electron-api/modules/services/ipfs');
const ipcServices = require('../../electron-api/modules/ipc/index.js');
const electron = require('electron');
const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
    gethService.getInstance().stop();
    ipfsService.getInstance().stop();
});


app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 600,
        resizable: true
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();
        mainWindow.focus();
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    ipcServices.initIPCServices(mainWindow);
});
