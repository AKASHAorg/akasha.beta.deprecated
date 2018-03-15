export default {
    collectionName : `profiles-akasha-${process.env.AKASHA_VERSION}-${process.env.NODE_ENV}`,
    options : {
        indices: ['ethAddress', 'akashaId']
    }
};


/**
import Dexie from 'dexie';
import tempProfileSchema from './schema/temp-profile';
import loggedProfileSchema from './schema/logged-profile';

const dbName = `profiles-akasha-${process.env.AKASHA_VERSION}-${process.env.NODE_ENV}`;
const profileDB = new Dexie(dbName);
profileDB.version(1).stores({
    loggedProfile: '&ethAddress, akashaId',
    tempProfile: '&ethAddress'
});

profileDB.version(2).stores({
    lastBlockNrs: '&ethAddress'
});

profileDB.tempProfile.defineClass(tempProfileSchema);
profileDB.tempProfile.defineClass(loggedProfileSchema);

export default profileDB;
**/
