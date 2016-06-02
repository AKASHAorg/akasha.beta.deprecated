
const {ipcMain} = require('electron');
const {dialog} = require('electron');
/**
* just a quick play
*/
export function setupListeners(mainWindow){
    ipcMain.on('go-gabi', (event, arg) => {
      console.log('server says: ' + arg);
      if(arg == 'ping') {
        event.sender.send('go-gabi-reply', 'pong');
    } else {
       dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']});
    }
    });
    
    ipcMain.on('change-win-size', (event, arg) => {
      console.log('server says: ' + arg);  // prints "ping"
      mainWindow.setSize(arg.w, arg.h);
//      event.sender.send('win-size-change', {
//          w: 1200,
//          h: 850
//      });
    });
    
}
