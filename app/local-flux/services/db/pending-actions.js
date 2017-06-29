import Dexie from 'dexie';
import pendingActionSchema from './schema/pending-action-schema';

const dbName = `pending-actions-akasha-alpha-${process.env.NODE_ENV}`;

const pendingActionsDb = new Dexie(dbName);
pendingActionsDb.version(1).stores({
    actions: '&id, akashaId',
    payloads: 'localId, akashaId'
});

pendingActionsDb.actions.mapToClass(pendingActionSchema);

pendingActionsDb.actions.hook('creating', (primaryKey, obj) => {
    obj.created_at = new Date().toString();
    obj.updated_at = new Date().toString();
});

pendingActionsDb.actions.hook('updating', (modifications, primaryKey, obj) => ({
    updated_at: new Date().toString(),
    created_at: obj.created_at
}));

export default pendingActionsDb;
