"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const geth_connector_1 = require("@akashaproject/geth-connector");
const ipfs_connector_1 = require("@akashaproject/ipfs-connector");
const pino = require("pino");
const sp_1 = require("@akashaproject/core/sp");
const init_modules_1 = require("./init-modules");
const path_1 = require("path");
const menu_1 = require("./menu");
const watcher_1 = require("./watcher");
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
const startBrowser = function (logger) {
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
    mainWindow.loadURL(process.env.HOT ? 'http://localhost:3000/dist/index.html' :
        `file://${viewHtml}/dist/index.html`);
    mainWindow.once('close', (ev) => {
        ev.preventDefault();
        stopServices();
    });
    menu_1.initMenu(mainWindow)
        .then(() => logger.info('Menu init -> done.'))
        .catch(error => logger.error(error));
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
        logger.error('APP is unresponsive');
    });
};
const bootstrap = function () {
    const appLogger = pino(pino.destination(path_1.join(electron_1.app.getPath('userData'), 'app.log')));
    if (process.env.AKASHA_LOG_LEVEL) {
        appLogger.level = process.env.AKASHA_LOG_LEVEL;
    }
    else if (!process.env.HOT) {
        appLogger.level = 'error';
    }
    const windowLogger = appLogger.child({ module: 'window' });
    electron_1.app.on('window-all-closed', () => {
        electron_1.app.quit();
    });
    const gotTheLock = electron_1.app.requestSingleInstanceLock();
    if (!gotTheLock) {
        electron_1.app.quit();
    }
    else {
        electron_1.app.on('second-instance', (event, commandLine, workingDirectory) => {
            if (mainWindow) {
                if (mainWindow.isMinimized())
                    mainWindow.restore();
                mainWindow.focus();
            }
        });
        electron_1.app.on('ready', () => {
            console.time('total');
            console.time('buildWindow');
            process.on('uncaughtException', (err) => {
                appLogger.error(err);
            });
            process.on('warning', (warning) => {
                appLogger.warn(warning);
            });
            process.on('SIGINT', stopServices);
            process.on('SIGTERM', stopServices);
            init_modules_1.default(sp_1.default, sp_1.getService, appLogger)
                .then((modules) => {
                appLogger.info('modules inited');
                startBrowser(windowLogger);
                appLogger.info('browser started');
                watcher_1.default(modules, mainWindow.id, sp_1.getService, appLogger);
                appLogger.info('ipc listening');
            });
        });
    }
};
exports.default = bootstrap;
//# sourceMappingURL=main.js.map