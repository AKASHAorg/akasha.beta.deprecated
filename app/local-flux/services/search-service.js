import searchDB from './db/search';

export const getLastEntriesBlock = ethAddress =>
    searchDB.lastEntriesBlock
        .where('ethAddress')
        .equals(ethAddress)
        .first()
        .then((data) => {
            if (!data) {
                return 0;
            }
            return data.blockNr;
        });

export const getLastTagsBlock = type =>
    searchDB.lastTagsBlock
        .where('type')
        .equals(type)
        .first()
        .then((data) => {
            if (!data) {
                return null;
            }
            return data.blockNr;
        });

export const updateLastEntriesBlock = ({ ethAddress, blockNr }) =>
    searchDB.lastEntriesBlock
        .put({ ethAddress, blockNr });

export const updateLastTagsBlock = ({ type, blockNr }) =>
    searchDB.lastTagsBlock
        .put({ type, blockNr });
