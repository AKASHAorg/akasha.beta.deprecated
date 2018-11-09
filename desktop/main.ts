import { app, BrowserWindow, shell } from 'electron';
import { GethConnector } from '@akashaproject/geth-connector';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import * as pino from 'pino';
import sp, { getService } from '@akashaproject/core/sp';
import initModules from './init-modules';
import { join, resolve } from 'path';
import { initMenu } from './menu';
import startDataStream from './watcher';
import * as Promise from 'bluebird';

const windowStateKeeper = require('electron-window-state');

let mainWindow = null;
const shutDown = Promise.coroutine(function* () {
  yield GethConnector.getInstance().stop();
  yield IpfsConnector.getInstance().stop();
  return true;
});

const stopServices = () => {
  mainWindow.hide();
  shutDown().delay(800).finally(() => process.exit(0));
};

const startBrowser = function (logger) {
  const viewHtml = resolve(__dirname, '../..');
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1280,
    defaultHeight: 720,
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
      preload: resolve(__dirname, './preloader.js'),
      scrollBounce: true,
    },
  });
  mainWindowState.manage(mainWindow);
  console.timeEnd('buildWindow');
  mainWindow.loadURL(
    process.env.HOT ? 'http://localhost:3000/dist/index.html' :
      `file://${viewHtml}/dist/index.html`,
  );
  mainWindow.once('close', (ev: Event) => {
    ev.preventDefault();
    stopServices();
  });
  // Init browserWindow menu
  initMenu(mainWindow)
  .then(() => logger.info('Menu init -> done.'))
  .catch(error => logger.error(error));
  // until all resources are loaded the renderer browser is hidden
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    console.timeEnd('total');
  });
  mainWindow.webContents.on('crashed', (e) => {
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
    logger.error('APP is unresponsive');
  });
};

const bootstrap = function () {

  app.on('window-all-closed', () => {
    app.quit();
  });

  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }
    });

    app.on('ready', () => {
      console.time('total');
      console.time('buildWindow');
      const appLogger = pino(pino.destination(join(app.getPath('userData'), 'app.log')));
      // default logging lvl is info
      if (process.env.AKASHA_LOG_LEVEL) {
        appLogger.level = process.env.AKASHA_LOG_LEVEL;
      } else if (!process.env.HOT) {
        // production logs
        appLogger.level = 'error';
      }
      const windowLogger = appLogger.child({ module: 'window' });
      process.on('uncaughtException', (err: Error) => {
        appLogger.error(err);
      });
      process.on('warning', (warning) => {
        appLogger.warn(warning);
      });
      process.on('SIGINT', stopServices);
      process.on('SIGTERM', stopServices);

      // start app
      initModules(sp, getService, appLogger)
        .then((modules) => {
          appLogger.info('modules inited');
          startBrowser(windowLogger);
          appLogger.info('browser started');
          startDataStream(modules, mainWindow.id, getService, appLogger);
          appLogger.info('ipc listening');
        });
    });
  }

};

export default bootstrap;
