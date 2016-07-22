"use strict";
const electron_1 = require('electron');
const geth_connector_1 = require('@akashaproject/geth-connector');
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
const path_1 = require('path');
const exports_1 = require('./lib/ipc/exports');
const viewHtml = path_1.resolve(__dirname, '../app');
const modules = exports_1.initModules();
electron_1.crashReporter.start({
    productName: 'Akasha',
    companyName: 'Akasha Project',
    submitURL: 'https://github.com/AkashaProject/node-app/',
    autoSubmit: false
});
if (process.env.NODE_ENV === 'development') {
    require('electron-debug')({ showDevTools: true });
}
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('will-quit', () => {
    geth_connector_1.GethConnector.getInstance().stop();
    ipfs_connector_1.IpfsConnector.getInstance().stop();
});
electron_1.app.on('ready', () => {
    const mainWindow = new electron_1.BrowserWindow({
        width: 1280,
        height: 720,
        resizable: true,
        webPreferences: {
            preload: path_1.resolve(__dirname, 'preloader.js')
        }
    });
    if (process.env.HOT) {
        mainWindow.loadURL(`file://${viewHtml}/hot-dev-app.html`);
    }
    else {
        mainWindow.loadURL(`file://${viewHtml}/app.html`);
    }
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();
        mainWindow.focus();
        modules.logger.registerLogger('APP');
        modules.initListeners(mainWindow.webContents);
    });
    mainWindow.webContents.on('crashed', () => {
        modules.logger.getLogger('APP').warn('APP CRASHED');
    });
    mainWindow.on('unresponsive', () => {
        modules.logger.getLogger('APP').warn('APP is unresponsive');
    });
    process.on('uncaughtException', (err) => {
        console.log(err);
        modules.logger.getLogger('APP').error(`${err.message} ${err.stack}`);
    });
});
//# sourceMappingURL=index.js.map