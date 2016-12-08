import Dexie from 'dexie';
import draftSchema from './schema/draft';

const dbName = (process.env.NODE_ENV === 'production') ? 'entries-akasha' : 'entries-dev';
const entriesDB = new Dexie(dbName);
entriesDB.version(1).stores({
    drafts: '++id,profile,status.publishingConfirmed,status.publishing',
    entries: '&ipfsHash',
    savedEntries: '&akashaId'
});

entriesDB.drafts.mapToClass(draftSchema);

entriesDB.drafts.hook('creating', (primaryKey, obj) => {
    obj.status = {
        created_at: new Date().toString(),
        updated_at: new Date().toString(),
        tagsPublished: false,
        publishing: false,
        publishingConfirmed: false,
        currentAction: null,
    };
});

entriesDB.drafts.hook('updating', (modifications, primaryKey, obj) => ({
    'status.updated_at': new Date().toString(),
    'status.created_at': obj.status.created_at
})
    // return {
    //     status: {
    //         created_at: obj.status.created_at,
    //         updated_at: new Date().toString(),
    //         tagsPublished: obj.status.tagsPublished,
    //         publishing: obj.status.publishing
    //     }
    // };
);


export default entriesDB;
