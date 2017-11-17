import searchDB from './db/search';

export const getLastBlock = type =>
    searchDB.lastBlock
        .where('type')
        .equals(type)
        .first()
        .then((data) => {
            if (!data) {
                return null;
            }
            return data.blockNr;
        });

export const updateLastBlock = ({ type, blockNr }) =>
    searchDB.lastBlock
        .put({ type, blockNr });
