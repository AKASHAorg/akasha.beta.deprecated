import Dexie from 'dexie';
import debug from 'debug';
const dbg = debug('App:profileDB');

const profileDB = new Dexie('profiles');
profileDB.version(1).stores({
    localProfiles: '&address, profileData',
    loggedProfile: '&address, profileData',
    newProfile: '&name, profileData, currentStep'
});

profileDB.newProfile.hook('creating', (primaryKey, obj) => {
    dbg('creating newProfile ', obj);
});
profileDB.newProfile.hook('creating', (primaryKey, obj) => {
    dbg('creating newProfile ', obj);
});
profileDB.localProfiles.hook('creating', (primaryKey, obj) => {
    dbg('creating localProfiles ', obj);
});
profileDB.loggedProfile.hook('creating', (primaryKey, obj) => {
    dbg('creating loggedProfile ', obj);
});

profileDB.open();

export default profileDB;
