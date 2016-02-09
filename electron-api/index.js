/* eslint strict: 0 */
'use strict';
require('babel-register');

const ipcMain = require('electron').ipcMain;
const geth    = require('./modules/geth');
const ipfs    = require('./modules/ipfs');

const gethInstance = geth.getInstance();
const ipfsInstance = ipfs.getInstance();

setTimeout(function () {
  gethInstance.start();
}, 10);


const apiWrapper = function (mainWindow) {
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
};

module.exports = apiWrapper;
