/* eslint strict: 0 */
'use strict';
require("babel-register");

const ipcMain = require('electron').ipcMain;
const geth = require('./modules/geth');
const ipfs = require('./modules/ipfs');

const gethInstance = geth.getInstance();
const ipfsInstance = ipfs.getInstance();

gethInstance.start();

const apiWrapper = function (mainWindow) {
  ipcMain.on('set-window-size', function (event, width, height) {
    mainWindow.setSize(width, height);
  });
};

module.exports = apiWrapper;
