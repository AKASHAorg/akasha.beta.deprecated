"use strict";
const electron_1 = require('electron');
const geth_connector_1 = require('@akashaproject/geth-connector');
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
const path_1 = require('path');
const index_1 = require('./lib/ipc/index');
const feed_1 = require('./lib/ipc/modules/notifications/feed');
const fetch_1 = require('./lib/ipc/modules/chat/fetch');
const menu_1 = require('./menu');
const Logger_1 = require('./lib/ipc/Logger');
const check_version_1 = require('./check-version');
let modules;
const stopServices = () => {
    feed_1.default.execute({ stop: true });
    fetch_1.default.execute({ stop: true });
    if (modules) {
        modules.flushAll();
    }
    geth_connector_1.GethConnector.getInstance().stop();
    ipfs_connector_1.IpfsConnector.getInstance().stop();
    setTimeout(() => {
        process.exit(0);
    }, 1200);
};
function bootstrapApp() {
    let mainWindow = null;
    const viewHtml = path_1.resolve(__dirname, '../app');
    electron_1.crashReporter.start({
        productName: 'AKASHA',
        companyName: 'Akasha Project',
        submitURL: 'http://46.101.103.114:1127',
        autoSubmit: true
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
        modules = index_1.initModules();
        Logger_1.default.getInstance();
        mainWindow = new electron_1.BrowserWindow({
            width: 1280,
            height: 720,
            minHeight: 720,
            minWidth: 1280,
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
            feed_1.default.execute({ stop: true });
            fetch_1.default.execute({ stop: true });
            modules.flushAll();
            geth_connector_1.GethConnector.getInstance().stop();
            ipfs_connector_1.IpfsConnector.getInstance().stop();
            setTimeout(() => electron_1.app.quit(), 1200);
        });
        menu_1.initMenu(mainWindow);
        mainWindow.webContents.once('did-finish-load', () => {
            modules.logger.registerLogger('APP');
            modules.initListeners(mainWindow.webContents);
            check_version_1.default.setWindow(mainWindow);
        });
        mainWindow.once('ready-to-show', () => {
            mainWindow.show();
            mainWindow.focus();
        });
        mainWindow.webContents.on('crashed', (e) => {
            stopServices();
            console.log(e);
            modules.logger.getLogger('APP').warn(`APP CRASHED ${e.message} ${e.stack} ${e}`);
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