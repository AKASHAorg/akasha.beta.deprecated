import Dexie from 'dexie';
import { getDraftClass } from './schema/draft';

const entriesDB = new Dexie('entries');
entriesDB.version(1).stores({
    drafts: '++id,profile,status.publishingConfirmed,status.publishing',
    entries: '&ipfsHash',
    savedEntries: '++id,akashaId'
});

entriesDB.drafts.mapToClass(getDraftClass());

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

entriesDB.drafts.hook('updating', (modifications, primaryKey, obj) => {
    return {
        'status.updated_at': new Date().toString(),
        'status.created_at': obj.status.created_at
    };
    // return {
    //     status: {
    //         created_at: obj.status.created_at,
    //         updated_at: new Date().toString(),
    //         tagsPublished: obj.status.tagsPublished,
    //         publishing: obj.status.publishing
    //     }
    // };
});

entriesDB.open();

export default entriesDB;
