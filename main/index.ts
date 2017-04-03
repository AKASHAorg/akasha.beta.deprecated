/// <reference path="typings/main.d.ts" />
import { app, crashReporter, BrowserWindow, shell } from 'electron';
import { GethConnector } from '@akashaproject/geth-connector';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import { resolve } from 'path';
import { initModules } from './lib/ipc/index';
import feed from './lib/ipc/modules/notifications/feed';
import fetch from './lib/ipc/modules/chat/fetch';
import { initMenu } from './menu';
import Logger from './lib/ipc/Logger';
import updater from './check-version';

const windowStateKeeper = require('electron-window-state');

let modules;
const stopServices = () => {
    feed.execute({ stop: true });
    fetch.execute({ stop: true });
    if (modules) {
        modules.flushAll();
    }
    GethConnector.getInstance().stop();
    IpfsConnector.getInstance().stop();
    setTimeout(() => {
        process.exit(0);
    }, 1200);
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
            mainWindow.focus()
        }
    });

    if (shouldQuit) {
        app.quit()
    }

    app.on('ready', () => {
        modules = initModules();
        Logger.getInstance();
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
                preload: resolve(__dirname, 'preloader.js')
            }

        });

        mainWindowState.manage(mainWindow);

        if (process.env.HOT) {
            mainWindow.loadURL(`file://${viewHtml}/app/hot-dev-app.html`);
        } else {
            mainWindow.loadURL(`file://${viewHtml}/dist/app.html`);
        }

        mainWindow.once('close', (ev: Event) => {
            ev.preventDefault();
            feed.execute({ stop: true });
            fetch.execute({ stop: true });
            modules.flushAll();
            GethConnector.getInstance().stop();
            IpfsConnector.getInstance().stop();
            setTimeout(() => app.quit(), 1200);
        });
        initMenu(mainWindow);
        mainWindow.webContents.once('did-finish-load', () => {
            modules.logger.registerLogger('APP');
            modules.initListeners(mainWindow.webContents);
            updater.setWindow(mainWindow);
        });

        mainWindow.once('ready-to-show', () => {
            mainWindow.show();
            mainWindow.focus();
        });

        mainWindow.webContents.on('crashed', (e) => {
            stopServices();
            modules.logger.getLogger('APP').warn(`APP CRASHED ${e.message} ${e.stack} ${e}`);
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
        process.on('uncaughtException', (err: Error) => {
            modules.logger.getLogger('APP').error(`${err.message} ${err.stack}`);
        });
        process.on('SIGINT', stopServices);
        process.on('SIGTERM', stopServices);
    });
}


