
import profileApi from './modules/profiles';
import * as ProfileHelpers from './modules/profiles/helpers';
import * as ProfileUpload from './modules/profiles/upload';
const faucet = require('./modules/transactions/faucet');
const UserPrefs = require('./models/UserPreferences');
const userPrefs = new UserPrefs();

global.userPreferences = userPrefs;

global.akasha.userPrefs = userPrefs;
global.akasha.faucet = faucet;

global.akasha.profileInstance = profileApi.getInstance();
global.akasha.profileHelpers = ProfileHelpers;
global.akasha.profileUpload = ProfileUpload;
