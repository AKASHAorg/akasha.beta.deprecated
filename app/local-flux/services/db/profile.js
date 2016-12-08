import Dexie from 'dexie';
import tempProfileSchema from './schema/temp-profile';
import loggedProfileSchema from './schema/logged-profile';

const dbName = (process.env.NODE_ENV === 'production') ? 'profiles-akasha' : 'profiles-dev';
const profileDB = new Dexie(dbName);
profileDB.version(1).stores({
    localProfiles: '&address, akashaId',
    loggedProfile: '&account, profile, akashaId',
    tempProfile: '&akashaId, currentStatus'
});

//
// Ugrading to a new version
//
// profileDB.version(2).stores({
//     localProfiles: '&account, createdAt',
//     loggedProfile: '&account',
//     tempProfile: '&akashaId, currentStatus'
// }).upgrade((transaction) => {
//     transaction.localProfiles.toCollection().modify((profile) => {
//         profile.account = profile.address;
//         profile.createdAt = new Date();
//         delete profile.address;
//         delete profile.akashaId;
//     });
// });

profileDB.tempProfile.defineClass(tempProfileSchema);
profileDB.tempProfile.defineClass(loggedProfileSchema);

export default profileDB;
