/* eslint strict: 0 */
'use strict';
require('babel-register');
require('./globals');

const ipcMain = require('electron').ipcMain;
<<<<<<< HEAD
const geth    = require('./modules/geth');
const ipfs    = require('./modules/ipfs');
const globals = require('./globals');

// Hook contract IPC events
require('./modules/transactions');
require('./modules/profiles');


const gethInstance = geth.getInstance();
const ipfsInstance = ipfs.getInstance();
=======
>>>>>>> 6ac8603f7e4f7c01ef2faa422690d3143bd646a0

const startAll = function () {
  gethInstance.start({ extra: ['--testnet'] });
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
