"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const geth_connector_1 = require("@akashaproject/geth-connector");
const ipfs_connector_1 = require("@akashaproject/ipfs-connector");
const sp_1 = require("@akashaproject/core/sp");
const constants_1 = require("@akashaproject/common/constants");
const ipc_channel_main_1 = require("./ipc-channel-main");
const init_modules_1 = require("./init-modules");
const path_1 = require("path");
const menu_1 = require("./menu");
const Promise = require("bluebird");
const windowStateKeeper = require('electron-window-state');
let mainWindow = null;
const shutDown = Promise.coroutine(function* () {
    yield geth_connector_1.GethConnector.getInstance().stop();
    yield ipfs_connector_1.IpfsConnector.getInstance().stop();
    return true;
});
const stopServices = () => {
    mainWindow.hide();
    shutDown().delay(800).finally(() => process.exit(0));
};
const startBrowser = function () {
    const viewHtml = path_1.resolve(__dirname, '../..');
    const mainWindowState = windowStateKeeper({
        defaultWidth: 1280,
        defaultHeight: 720,
    });
    mainWindow = new electron_1.BrowserWindow({
        minHeight: 720,
        minWidth: 1280,
        resizable: true,
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        show: false,
        webPreferences: {
            preload: path_1.resolve(__dirname, './preloader.js'),
            scrollBounce: true,
        },
    });
    mainWindowState.manage(mainWindow);
    console.timeEnd('buildWindow');
    mainWindow.loadURL(process.env.HOT ? `http://localhost:3000/dist/index.html` :
        `file://${viewHtml}/dist/index.html`);
    mainWindow.once('close', (ev) => {
        ev.preventDefault();
        stopServices();
    });
    menu_1.initMenu(mainWindow)
        .then(() => console.info('Menu init -> done.'))
        .catch(error => console.error(error));
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
        console.timeEnd('total');
    });
    mainWindow.webContents.on('crashed', (e) => {
        stopServices();
    });
    const openDefault = (e, url) => {
        e.preventDefault();
        electron_1.shell.openExternal(url);
    };
    mainWindow.webContents.on('will-navigate', openDefault);
    mainWindow.webContents.on('new-window', openDefault);
    mainWindow.on('unresponsive', () => {
        console.error('APP is unresponsive');
    });
};
const bootstrap = function () {
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
        console.time('total');
        console.time('buildWindow');
        process.on('uncaughtException', (err) => {
            console.error(`uncaughtException ${err.message} ${err.stack}`);
        });
        process.on('warning', (warning) => {
            console.warn(warning);
        });
        process.on('SIGINT', stopServices);
        process.on('SIGTERM', stopServices);
        init_modules_1.default(sp_1.default, sp_1.getService)
            .then((modules) => {
            console.log(modules);
            startBrowser();
            const ipcChannelMain = new ipc_channel_main_1.default(constants_1.CORE_MODULE.DATA, {
                channelName: 'mainChannel',
                windowId: mainWindow.id,
            });
            ipcChannelMain.on(function (ev, args) {
                console.log(ev, args);
                ipcChannelMain.send({ main: args });
            });
        });
    });
};
exports.default = bootstrap;
//# sourceMappingURL=main.js.map