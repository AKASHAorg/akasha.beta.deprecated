export default {
    collectionName : `chat-akasha-${process.env.AKASHA_VERSION}-${process.env.NODE_ENV}`,
    options : {
        indices: ['akashaId']
    }
};

