import profileApi from './modules/profiles';
import * as profileHelpers from './modules/profiles/helpers';
import * as profileUpload from './modules/profiles/upload';
const faucet = require('./modules/transactions/faucet');
const UserPrefs = require('./models/UserPreferences');

setTimeout(() => {
  const userPrefs = new UserPrefs();

  window.akasha = {
    userPreferences: userPrefs
  };
}, 20);
