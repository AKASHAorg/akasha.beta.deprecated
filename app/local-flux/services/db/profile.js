import Dexie from 'dexie';
import tempProfileSchema from './schema/temp-profile';
import loggedProfileSchema from './schema/logged-profile';

const dbName = `profiles-akasha-${process.env.AKASHA_VERSION}-${process.env.NODE_ENV}`;
const profileDB = new Dexie(dbName);
profileDB.version(1).stores({
    loggedProfile: '&ethAddress, akashaId',
    tempProfile: '&ethAddress'
});

profileDB.tempProfile.defineClass(tempProfileSchema);
profileDB.tempProfile.defineClass(loggedProfileSchema);

export default profileDB;
