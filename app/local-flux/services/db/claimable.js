export default {
    collectionName: `claimable-akasha-${ process.env.AKASHA_VERSION }-${ process.env.NODE_ENV }`,
    options: {
        indices: ['ethAddress', 'entryId'],
    }
};
