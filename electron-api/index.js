/* eslint strict: 0 */
'use strict';
require('babel-register');

const ipcMain = require('electron').ipcMain;
const geth    = require('./modules/geth');
const ipfs    = require('./modules/ipfs');
const Promise = require('bluebird');
const globals = require('./globals');

const gethInstance = geth.getInstance();
const ipfsInstance = ipfs.getInstance();

const startAll = function () {
  gethInstance.start();
  ipfsInstance.start();
};

const apiWrapper = function (mainWindow) {

  mainWindow.on('closed', () => {
    gethInstance.stop();
    ipfsInstance.stop();
    mainWindow = null;
  });

  mainWindow.on('setSize', (width, height) => {
    mainWindow.setSize(width, height);
  });

  ipcMain.on('set-window-size', function (event, width, height) {
    mainWindow.setSize(width, height);
  });

  ipcMain.on('request-unlock-account', function (event, account, password, timer = 60) {
    gethInstance
      .ipcCall('personal_unlockAccount', [account, password, timer])
      .then(function (isUnlocked) {
        event.sender.send('response-unlock-account', isUnlocked);
      }).catch(function (err) {
        console.log(err);
      });
  });
  setTimeout(startAll, 50);

};

module.exports = apiWrapper;
