/* eslint strict: 0 */
'use strict';
require('babel-register');
const gethService = require('./electron-api/modules/services/geth');
const ipfsService = require('./electron-api/modules/services/ipfs-connector');
const electron = require('electron');
const app = electron.app;

const BrowserWindow = electron.BrowserWindow;
const crashReporter = electron.crashReporter;

let mainWindow = null;

crashReporter.start({
    productName: 'Akasha',
    companyName: 'Akasha Project',
    submitURL: 'https://github.com/AkashaProject/node-app/',
    autoSubmit: false
});

if (process.env.NODE_ENV === 'development') {
    require('electron-debug')();
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
    gethService.getInstance().stop();
    ipfsService.getInstance().stop();
});


app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 900,
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
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();
        mainWindow.focus();
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    require('./electron-api/modules/ipc/index.js').initIPCServices(mainWindow);
});
