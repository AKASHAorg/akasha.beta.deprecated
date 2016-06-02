
const Logger = require('./loggers');
const electron = require('electron');
const remote = electron.remote;
let app = remote.app;

const userData = app.getPath('userData');
const linvoDb = require('linvodb3');
linvoDb.dbPath = userData;
Logger.getInstance(userData);

const UserPrefs = require('./models/UserPreferences');

setTimeout(() => {
  const userPrefs = new UserPrefs();

  window.akasha = {
    userPreferences: userPrefs
  };
}, 20);
