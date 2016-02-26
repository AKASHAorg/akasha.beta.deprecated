const UserPreferences = require('./models/UserPreferences');

const userPreferences  = new UserPreferences();
global.userPreferences = {};


userPreferences.getServicesConfig(function (err, data) {
  if (!err) {
    global.userPreferences = data;
  }

});
