/// <reference path="typings/main.d.ts" />
import { app, crashReporter, BrowserWindow, shell } from 'electron';
import { GethConnector } from '@akashaproject/geth-connector';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import { resolve } from 'path';
import { initModules } from './lib/ipc/index';
import { initMenu } from './menu';


export function bootstrapApp() {
    let mainWindow = null;
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
        const modules = initModules();
        mainWindow = new BrowserWindow({
            width: 1280,
            height: 720,
            resizable: true,
            show: false,
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

        mainWindow.once('close', (ev: Event) => {
            ev.preventDefault();
            modules.flushAll();
            GethConnector.getInstance().stop();
            IpfsConnector.getInstance().stop();
            setTimeout(() => app.quit(), 300);
        });
        initMenu(mainWindow);
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
            console.log(err);
            modules.logger.getLogger('APP').error(`${err.message} ${err.stack}`);
        });
    });
}


