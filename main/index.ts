/// <reference path="typings/main.d.ts" />
import { app, BrowserWindow, crashReporter, shell } from 'electron';
import { GethConnector } from '@akashaproject/geth-connector';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import { resolve } from 'path';
import { initModules } from './init-modules';
import feed from './modules/notifications/feed';
import fetch from './modules/chat/fetch';
import { initMenu } from './menu';
import updater from './check-version';
import * as Promise from 'bluebird';

const windowStateKeeper = require('electron-window-state');

let modules;
const shutDown = Promise.coroutine(function*() {
    yield feed.execute({ stop: true });
    yield fetch.execute({ stop: true });
    yield GethConnector.getInstance().stop();
    yield IpfsConnector.getInstance().stop();
    return true;
});

const stopServices = () => {
    if (modules) {
        modules.flushAll();
    }
    shutDown().delay(800).then(() => process.exit(0));
};

export function bootstrapApp() {
    let mainWindow = null;
    const viewHtml = resolve(__dirname, '..');
    if (process.env.NODE_ENV !== 'development') {
        crashReporter.start({
            productName: 'AKASHA',
            companyName: 'Akasha Project',
            submitURL: 'http://46.101.103.114:1127/post',
            autoSubmit: true
        });
    }

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
        console.time('mainProcess');
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
        modules.initListeners(mainWindow.webContents).then(() => {
            console.timeEnd('mainProcess');
            mainWindow.loadURL(process.env.HOT ? `file://${viewHtml}/app/hot-dev-app.html` : `file://${viewHtml}/dist/app.html`);
            mainWindow.once('close', (ev: Event) => {
                ev.preventDefault();
                modules.flushAll();
                shutDown().delay(800).then(() => app.quit());
            });
            initMenu(mainWindow);
            mainWindow.webContents.once('did-finish-load', () => {
                modules.logger.registerLogger('APP');
                updater.setWindow(mainWindow);
            });
            mainWindow.once('ready-to-show', () => {
                mainWindow.show();
                mainWindow.focus();
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
}


