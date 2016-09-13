/// <reference path="typings/main.d.ts" />
import { app, crashReporter, BrowserWindow } from 'electron';
import { GethConnector } from '@akashaproject/geth-connector';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import { resolve } from 'path';
import { initModules } from './lib/ipc/index';

export function bootstrapApp() {
    const viewHtml = resolve(__dirname, '../app');
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


    app.on('ready', () => {
        const modules = initModules();
        const mainWindow = new BrowserWindow({
            width: 1280,
            height: 720,
            resizable: true,
            show: false,
            webPreferences: {
                // nodeIntegration: false,
                preload: resolve(__dirname, 'preloader.js')
            }
        });
         // BrowserWindow.addDevToolsExtension('/home/marius/.config/chromium/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/0.15.0_0');
        if (process.env.HOT) {
            mainWindow.loadURL(`file://${viewHtml}/hot-dev-app.html`);
        } else {
            mainWindow.loadURL(`file://${viewHtml}/app.html`);
        }

        mainWindow.on('close', (ev: Event) => {
            ev.preventDefault();
            modules.flushAll();
            GethConnector.getInstance().stop();
            IpfsConnector.getInstance().stop();
            setTimeout(() => app.quit(), 300);
        });

        mainWindow.webContents.on('did-finish-load', () => {
            modules.logger.registerLogger('APP');
            modules.initListeners(mainWindow.webContents);
        });

        mainWindow.once('ready-to-show', () => {
            mainWindow.show();
            mainWindow.focus();
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
}


