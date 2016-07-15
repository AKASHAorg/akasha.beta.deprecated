/// <reference path="typings/main.d.ts" />
import { app, crashReporter, BrowserWindow } from 'electron';
import { GethConnector } from '@akashaproject/geth-connector';
import { IpfsConnector } from '@akashaproject/ipfs-connector';


const userData = app.getPath('userData');
let mainWindow: any;

Logger.getInstance(userData);

crashReporter.start({
    productName: 'Akasha',
    companyName: 'Akasha Project',
    submitURL: 'https://github.com/AkashaProject/node-app/',
    autoSubmit: false
});

if (process.env.NODE_ENV === 'development') {
    require('electron-debug')();
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
    if (gethService.getInstance().ipcPipe) {
        gethService.getInstance().stop();
    }
    if (IpfsConnector.getInstance().process) {
        IpfsConnector.getInstance().stop();
    }
});


app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        resizable: true
    });
    if (process.env.HOT) {
        mainWindow.loadURL(`file://${__dirname}/app/hot-dev-app.html`);
    } else {
        mainWindow.loadURL(`file://${__dirname}/app/app.html`);
    }

    if (process.env.NODE_ENV === 'development') {
        mainWindow.openDevTools();
    }
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();
        mainWindow.focus();
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    ipcApi.initIPCServices(mainWindow);
});

