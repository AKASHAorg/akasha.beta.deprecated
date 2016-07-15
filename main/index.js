"use strict";
const electron_1 = require('electron');
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
const userData = electron_1.app.getPath('userData');
let mainWindow;
Logger.getInstance(userData);
electron_1.crashReporter.start({
    productName: 'Akasha',
    companyName: 'Akasha Project',
    submitURL: 'https://github.com/AkashaProject/node-app/',
    autoSubmit: false
});
if (process.env.NODE_ENV === 'development') {
    require('electron-debug')();
}
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('will-quit', () => {
    if (gethService.getInstance().ipcPipe) {
        gethService.getInstance().stop();
    }
    if (ipfs_connector_1.IpfsConnector.getInstance().process) {
        ipfs_connector_1.IpfsConnector.getInstance().stop();
    }
});
electron_1.app.on('ready', () => {
    mainWindow = new electron_1.BrowserWindow({
        width: 1280,
        height: 720,
        resizable: true
    });
    if (process.env.HOT) {
        mainWindow.loadURL(`file://${__dirname}/app/hot-dev-app.html`);
    }
    else {
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
    ipcApi.initIPCServices(mainWindow);
});
