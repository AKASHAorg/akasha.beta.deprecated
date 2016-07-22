/// <reference path="typings/main.d.ts" />
import { app, crashReporter, BrowserWindow } from 'electron';
import { GethConnector } from '@akashaproject/geth-connector';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import { resolve } from 'path';
import { initModules } from './lib/ipc/exports';

const viewHtml = resolve(__dirname, '../app');
const modules = initModules();
crashReporter.start({
    productName: 'Akasha',
    companyName: 'Akasha Project',
    submitURL: 'https://github.com/AkashaProject/node-app/',
    autoSubmit: false
});

if (process.env.NODE_ENV === 'development') {
    require('electron-debug')({ showDevTools: true });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
    GethConnector.getInstance().stop();
    IpfsConnector.getInstance().stop();
});

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        resizable: true,
        webPreferences: {
            // nodeIntegration: false,
            preload: resolve(__dirname, 'preloader.js')
        }
    });
    if (process.env.HOT) {
        mainWindow.loadURL(`file://${viewHtml}/hot-dev-app.html`);
    } else {
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
    process.on('uncaughtException', (err: Error) => {
        console.log(err);
        modules.logger.getLogger('APP').error(`${err.message} ${err.stack}`);
    });
});

