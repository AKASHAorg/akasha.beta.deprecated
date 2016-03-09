const UserPreferences = require('./models/UserPreferences');
const ipcMain = require('electron').ipcMain;

const userPreferences  = new UserPreferences();

global.userPreferences = userPreferences;



