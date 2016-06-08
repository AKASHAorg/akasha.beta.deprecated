import Dexie from 'dexie';

const db = new Dexie('profiles');
db.version(1).stores({
    localProfiles: ''
});

export default db;
