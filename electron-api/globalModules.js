import profileApi from './modules/profiles';
import * as ProfileHelpers from './modules/profiles/helpers';
const UserPrefs = require('./models/UserPreferences');
const userPrefs = new UserPrefs();

global.userPreferences = userPrefs;

global.akasha.userPrefs = userPrefs;
global.akasha.profileInstance = profileApi.getInstance();
global.akasha.profileHelpers = ProfileHelpers;
