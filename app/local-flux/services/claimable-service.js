import {akashaDB, getClaimableCollection} from './db/dbs';
import * as Promise from 'bluebird';

const STATUS = 'status';
const ENTRY = 'entry';

export const deleteEntry = ({ entryId, ethAddress }) => {
    try {
        const obj = getClaimableCollection().findOne({ ethAddress, entryId, opType: ENTRY });
        if (obj) {
            getClaimableCollection().remove(obj);
        }
        return Promise.fromCallback(cb => akashaDB.save(cb));
    } catch (error) {
        console.error('delete entry error', error);
        return Promise.reject(error);
    }
};

export const getEntries = ({ ethAddress, limit, offset }) => {
    try {
        const data = getClaimableCollection()
            .chain()
            .find({ ethAddress, opType: ENTRY })
            .simplesort('blockNumber', true)
            .offset(offset)
            .limit(limit)
            .data();
        return Promise.resolve(data);
    } catch (error) {
        console.error('get entries error', error);
        return Promise.reject(error);
    }
};

export const getStatus = (ethAddress) => {
    try {
        const record = getClaimableCollection().findOne({ ethAddress, opType: STATUS });
        return Promise.resolve(record || {});
    } catch (error) {
        console.error('claimable status', error);
        return Promise.reject(error);
    }
};

export const saveEntries = (data, request) => {
    try {
        const { ethAddress, reversed, toBlock } = request;
        const { collection, lastBlock, lastIndex } = data;
        const status = getClaimableCollection().findOne({ ethAddress, opType: STATUS });
        let newStatus;
        if (!status) {
            newStatus = {
                ethAddress,
                opType: STATUS,
                oldestBlock: lastBlock,
                oldestIndex: lastIndex,
                newestBlock: toBlock
            };
            getClaimableCollection().insert(newStatus);
        } else {
            getClaimableCollection()
                .findAndUpdate(
                    { ethAddress, opType: STATUS },
                    (rec) => {
                        if (reversed) {
                            rec.newestBlock = data.lastBlock;
                            rec.newestIndex = data.lastIndex;
                        } else {
                            rec.oldestBlock = data.lastBlock;
                            rec.oldestIndex = data.lastIndex;
                        }
                        newStatus = rec;
                    }
                );
        }
        collection.forEach((entry) => {
            const exists = getClaimableCollection().findOne({ ethAddress, entryId: entry.entryId });
            if (!exists) {
                const record = Object.assign({}, entry);
                record.ethAddress = ethAddress;
                record.opType = ENTRY;
                getClaimableCollection().insert(record);
            } else {
                console.log('entry already inserted');
            }
        });
        return Promise.fromCallback(cb => akashaDB.save(cb)).then(() => newStatus);
    } catch (error) {
        console.error('save entries error', error);
        return Promise.reject(error);
    }
};
