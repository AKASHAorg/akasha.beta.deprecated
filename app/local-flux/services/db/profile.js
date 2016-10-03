import Dexie from 'dexie';
import { tempProfileSchema } from './schema/temp-profile';
import debug from 'debug';

const dbg = debug('App:profileDB');

const profileDB = new Dexie('profiles');
profileDB.version(1).stores({
    localProfiles: '&address, username',
    loggedProfile: '&address, username',
    tempProfile: '&username, currentStatus'
});

profileDB.tempProfile.defineClass(tempProfileSchema);

profileDB.tempProfile.hook('creating', (primaryKey, obj) => {
    dbg('creating tempProfile ', obj);
});
profileDB.tempProfile.hook('creating', (primaryKey, obj) => {
    dbg('creating tempProfile ', obj);
});
profileDB.localProfiles.hook('creating', (primaryKey, obj) => {
    dbg('creating localProfiles ', obj);
});
profileDB.loggedProfile.hook('creating', (primaryKey, obj) => {
    dbg('creating loggedProfile ', obj);
});

profileDB.open();

export default profileDB;
