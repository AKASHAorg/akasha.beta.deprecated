/// <reference path="typings/main.d.ts" />
import { app, crashReporter, BrowserWindow } from 'electron';
import { GethConnector } from '@akashaproject/geth-connector';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import AppLogger from './lib/Logger';
import { resolve } from 'path';

const userData = app.getPath('userData');
const viewHtml = resolve(__dirname, '../app');
let mainWindow: any;

AppLogger.getInstance(userData);

crashReporter.start({
    productName: 'Akasha',
    companyName: 'Akasha Project',
    submitURL: 'https://github.com/AkashaProject/node-app/',
    autoSubmit: false
});

if (process.env.NODE_ENV === 'development') {
    require('electron-debug')({showDevTools: true});
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
    GethConnector.getInstance().stop();
    IpfsConnector.getInstance().stop();
});


app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        resizable: true
    });
    if (process.env.HOT) {
        mainWindow.loadURL(`file://${viewHtml}/hot-dev-app.html`);
    } else {
        mainWindow.loadURL(`file://${viewHtml}/app.html`);
    }

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();
        mainWindow.focus();
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

