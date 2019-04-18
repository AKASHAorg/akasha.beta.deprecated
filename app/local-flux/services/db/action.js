export default {
    collectionName: `action-akasha-${ process.env.AKASHA_VERSION }-${ process.env.NODE_ENV }`,
    options: {
        indices: ['ethAddress', 'status', 'type', 'id', 'created', 'claimed'],
        unique: ['tx', 'id']
    }
};
