import { akashaDB } from './dbs';

export const collectionName = `action-akasha-${process.env.AKASHA_VERSION}-${process.env.NODE_ENV}`;
export const options = {
    indices: ['ethAddress', 'status', 'type', 'id', 'created', 'claimed'],
    unique: ['tx', 'id']
};
const actionCollection = () => akashaDB.getCollection(collectionName);

export default actionCollection;
