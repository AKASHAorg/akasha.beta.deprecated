export default {
    collectionName: `entries-akasha-${ process.env.AKASHA_VERSION }-${ process.env.NODE_ENV }`,
    options: {
        indices: ['ethAddress', 'id'],
        unique: ['id']
    }
};

/**
 import draftSchema from './schema/draft';

 entriesDB.version(1).stores({
    drafts: '++id,ethAddress',
    entries: '&ipfsHash',
    savedEntries: '&ethAddress'
});

 entriesDB.drafts.mapToClass(draftSchema);

 entriesDB.drafts.hook('creating', (primaryKey, obj) => {
    obj.created_at = new Date().toString();
    obj.updated_at = new Date().toString();
});

 entriesDB.drafts.hook('updating', (modifications, primaryKey, obj) => ({
    updated_at: new Date().toString(),
    created_at: obj.created_at
}));


 export default entriesDB;
 **/
