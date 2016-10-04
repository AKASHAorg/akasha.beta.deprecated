"use strict";
const electron_1 = require('electron');
const geth_connector_1 = require('@akashaproject/geth-connector');
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
const path_1 = require('path');
const index_1 = require('./lib/ipc/index');
const menu_1 = require('./menu');
const stopServices = () => {
    geth_connector_1.GethConnector.getInstance().stop();
    ipfs_connector_1.IpfsConnector.getInstance().stop();
    setTimeout(() => {
        process.exit(0);
    }, 1000);
};
function bootstrapApp() {
    let mainWindow = null;
    const viewHtml = path_1.resolve(__dirname, '../app');
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
    const shouldQuit = electron_1.app.makeSingleInstance((commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized())
                mainWindow.restore();
            mainWindow.focus();
        }
    });
    if (shouldQuit) {
        electron_1.app.quit();
    }
    electron_1.app.on('ready', () => {
        const modules = index_1.initModules();
        mainWindow = new electron_1.BrowserWindow({
            width: 1280,
            height: 720,
            resizable: true,
            show: false,
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
        mainWindow.once('close', (ev) => {
            ev.preventDefault();
            modules.flushAll();
            geth_connector_1.GethConnector.getInstance().stop();
            ipfs_connector_1.IpfsConnector.getInstance().stop();
            setTimeout(() => electron_1.app.quit(), 1000);
        });
        menu_1.initMenu(mainWindow);
        mainWindow.webContents.on('did-finish-load', () => {
            modules.logger.registerLogger('APP');
            modules.initListeners(mainWindow.webContents);
        });
        mainWindow.once('ready-to-show', () => {
            mainWindow.show();
            mainWindow.focus();
        });
        mainWindow.webContents.on('crashed', () => {
            stopServices();
            modules.logger.getLogger('APP').warn('APP CRASHED');
        });
        const openDefault = (e, url) => {
            e.preventDefault();
            electron_1.shell.openExternal(url);
        };
        mainWindow.webContents.on('will-navigate', openDefault);
        mainWindow.webContents.on('new-window', openDefault);
        mainWindow.on('unresponsive', () => {
            modules.logger.getLogger('APP').warn('APP is unresponsive');
        });
        process.on('uncaughtException', (err) => {
            modules.logger.getLogger('APP').error(`${err.message} ${err.stack}`);
        });
        process.on('SIGINT', stopServices);
        process.on('SIGTERM', stopServices);
    });
}
exports.bootstrapApp = bootstrapApp;
//# sourceMappingURL=index.js.map