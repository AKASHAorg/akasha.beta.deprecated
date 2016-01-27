const ipcMain = require('electron').ipcMain;

const apiWrapper = function (mainWindow) {
  ipcMain.on('set-window-size', function (event, width, height) {
    mainWindow.setSize(width, height);
  });
};

module.exports = apiWrapper;
