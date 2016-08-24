/* eslint strict: 0 */
'use strict';
require('babel-register');
const electron = require('electron');
const gethService = require('./electron-api/modules/services/geth');
const { IpfsConnector } = require('./electron-api/modules/services/ipfs-connector');
const ipcApi = require('./electron-api/modules/ipc');
const Logger = require('./electron-api/loggers');
const app = electron.app;

const userData = app.getPath('userData');
const BrowserWindow = electron.BrowserWindow;
const crashReporter = electron.crashReporter;

let mainWindow = null;
Logger.getInstance(userData);

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
    if (gethService.getInstance().ipcPipe) {
        gethService.getInstance().stop();
    }
    if (IpfsConnector.getInstance().process) {
        IpfsConnector.getInstance().stop();
    }
});


app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: (1280 + 16),
        height: (720 + 59),
        resizable: true
    });
    if (process.env.HOT) {
        mainWindow.loadURL(`file://${__dirname}/app/hot-dev-app.html`);
    } else {
        mainWindow.loadURL(`file://${__dirname}/app/app.html`);
    }

    if (process.env.NODE_ENV === 'development') {
        mainWindow.openDevTools();
        // BrowserWindow.addDevToolsExtension('C:\\Users\\Sever Abibula\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\0.15.0_0');
    }
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();
        mainWindow.focus();
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    ipcApi.initIPCServices(mainWindow);
});
