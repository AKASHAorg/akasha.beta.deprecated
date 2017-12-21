/// <reference path="typings/main.d.ts" />
import { app, BrowserWindow, shell } from 'electron';
import { GethConnector } from '@akashaproject/geth-connector';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import { resolve } from 'path';
import { initModules } from './init-modules';
import feed from './modules/notifications/feed';
import { roomFactory } from './modules/chat/join';
import { initMenu } from './menu';
import updater from './check-version';
import * as Promise from 'bluebird';
import contracts from './contracts';

const windowStateKeeper = require('electron-window-state');

let modules;
let mainWindow = null;
const shutDown = Promise.coroutine(function* () {
    yield contracts.stopAllWatchers();
    yield feed.execute({ stop: true }, () => {
    });
    yield GethConnector.getInstance().stop();
    yield IpfsConnector.getInstance().stop();
    roomFactory.closeAll();
    return true;
});

const stopServices = () => {
    mainWindow.hide();
    if (modules) {
        modules.flushAll();
    }
    shutDown().delay(800).finally(() => process.exit(0));
};

(function bootstrapApp() {
    const viewHtml = resolve(__dirname, '..');

    if (process.env.NODE_ENV === 'development') {
        require('electron-debug')({ showDevTools: true });
    }

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });

    // prevent multiple instances of AKASHA
    const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    if (shouldQuit) {
        app.quit();
    }

    app.on('ready', () => {
        console.time('total');
        console.time('buildWindow');
        modules = initModules();
        let mainWindowState = windowStateKeeper({
            defaultWidth: 1280,
            defaultHeight: 720
        });
        mainWindow = new BrowserWindow({
            minHeight: 720,
            minWidth: 1280,
            resizable: true,
            x: mainWindowState.x,
            y: mainWindowState.y,
            width: mainWindowState.width,
            height: mainWindowState.height,
            show: false,
            webPreferences: {
                // nodeIntegration: false,
                preload: resolve(__dirname, 'preloader.js'),
                scrollBounce: true
            }
        });
        mainWindowState.manage(mainWindow);
        console.timeEnd('buildWindow');
        console.time('mainApi');
        modules.initListeners(mainWindow.webContents).then(() => {
            console.timeEnd('mainApi');
            mainWindow.loadURL(
                process.env.HOT ? `file://${viewHtml}/app/hot-dev-app.html` : `file://${viewHtml}/dist/index.html`
            );
            mainWindow.once('close', (ev: Event) => {
                ev.preventDefault();
                stopServices();
            });
            initMenu(mainWindow);
            mainWindow.webContents.once('did-finish-load', () => {
                modules.logger.registerLogger('APP');
                updater.setWindow(mainWindow);
            });
            mainWindow.once('ready-to-show', () => {
                mainWindow.show();
                mainWindow.focus();
                console.timeEnd('total');
            });
            mainWindow.webContents.on('crashed', (e) => {
                modules.logger.getLogger('APP').warn(`APP CRASHED ${e.message} ${e.stack} ${e}`);
                stopServices();
            });

            // prevent href link being opened inside app
            const openDefault = (e, url) => {
                e.preventDefault();
                shell.openExternal(url);
            };

            mainWindow.webContents.on('will-navigate', openDefault);
            mainWindow.webContents.on('new-window', openDefault);

            mainWindow.on('unresponsive', () => {
                modules.logger.getLogger('APP').warn('APP is unresponsive');
            });
        });
        process.on('uncaughtException', (err: Error) => {
            console.error(`uncaughtException ${err.message} ${err.stack}`);
        });
        process.on('warning', (warning) => {
            console.log(warning);
        });
        process.on('SIGINT', stopServices);
        process.on('SIGTERM', stopServices);
    });
})();


