import searchDB from './db/search';

export const getLastBlock = type =>
    new Promise((resolve, reject) =>
        searchDB.lastBlock
            .where('type')
            .equals(type)
            .first()
            .then(data => resolve(data.blockNr))
            .catch(reject)
    );

export const updateLastBlock = ({ type, blockNr }) =>
    new Promise((resolve, reject) =>
        searchDB.lastBlock
            .put({ type, blockNr })
            .then(resolve)
            .catch(reject)
    );
