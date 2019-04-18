export default {
    collectionName: `dashboard-akasha-${ process.env.AKASHA_VERSION }-${ process.env.NODE_ENV }`,
    options: {
        indices: ['ethAddress', 'id', 'name', 'orderIndex'],
        unique: ['id']
    }
};
