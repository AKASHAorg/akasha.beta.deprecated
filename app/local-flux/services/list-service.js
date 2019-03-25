import { akashaDB, getListCollection } from './db/dbs';
import * as Promise from 'bluebird';

export const addList = payload => {
    try {
        const timestamp = new Date().getTime();
        payload['timestamp'] = timestamp;
        payload['id'] = `${timestamp}-${payload.ethAddress}`;
        const record = getListCollection().insert(payload);
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb)).then(() => Object.assign({}, record));
    } catch (error) {
        return Promise.reject(error);
    }
};

// export const deleteEntry = ({ ethAddress, name, entryId }) =>
//     new Promise((resolve, reject) => {
//         listDB.lists
//             .where('[ethAddress+name]')
//             .equals([ethAddress, name])
//             .toArray()
//             .then((lists) => {
//                 const list = lists[0];
//                 if (!list) {
//                     reject({ message: 'Cannot find selected list' });
//                     return;
//                 }
//                 list.entryIds = list.entryIds || [];
//                 if (list.entryIds.indexOf(entryId) === -1) {
//                     reject({ message: 'Cannot find entry' });
//                     return;
//                 }
//                 list.entryIds = list.entryIds.filter(id => id !== entryId);
//                 listDB.lists
//                     .put(list)
//                     .then(() => resolve(list));
//             })
//             .catch(err => reject(err));
//     });

export const deleteList = listId => {
    try {
        getListCollection().findAndRemove({ id: listId });
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const editList = ({ id, name, description }) => {
    try {
        getListCollection().findAndUpdate({ id: id }, rec => {
            rec.name = name;
            rec.description = description;
        });
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllLists = ethAddress => {
    try {
        const records = getListCollection().find({ ethAddress: ethAddress });
        return Promise.resolve(records ? Array.from(records) : []);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getList = ({ ethAddress, id }) => {
    try {
        const record = getListCollection().findOne({ ethAddress: ethAddress, id: id });
        return Promise.resolve(record ? Object.assign({}, record) : {});
    } catch (error) {
        return Promise.reject(error);
    }
};

export const searchList = ({ ethAddress, search }) => {
    try {
        const records = getListCollection()
            .chain()
            .find({ ethAddress: ethAddress })
            .where(list => {
                let { name = '', description = '' } = list;
                name = name.toLowerCase();
                description = description.toLowerCase();
                return name.includes(search) || description.includes(search);
            });
        return Promise.resolve(records.data().map(list => list.id));
    } catch (error) {
        return Promise.reject(error);
    }
};

// export const updateEntryIds = ({ ethAddress, listNames, entryId }) =>
//     new Promise((resolve, reject) => {
//         listDB.lists
//             .where('ethAddress')
//             .equals(ethAddress)
//             .toArray()
//             .then((lists) => {
//                 const modifiedLists = [];
//                 lists.forEach((list) => {
//                     // Initialize entryIds with an empty array if it doesn't exist
//                     list.entryIds = list.entryIds || [];
//                     const entryExists = list.entryIds.includes(entryId);

//                     if (listNames.includes(list.name)) {
//                         // If list is in listNames, we should add the entryId
//                         if (!entryExists) {
//                             list.entryIds.push(entryId);
//                             modifiedLists.push(list);
//                         }
//                     } else if (entryExists) {
//                         // Otherwise if entryId is already added, it should be removed
//                         list.entryIds = list.entryIds.filter(id => id !== entryId);
//                         modifiedLists.push(list);
//                     }
//                 });

//                 listDB.lists
//                     .bulkPut(modifiedLists)
//                     .then(() => resolve(modifiedLists))
//                     .catch(reject);
//             })
//             .catch(err => reject(err));
//     });

export const toggleEntry = ({ ethAddress, id, entryId, entryType, authorEthAddress }) => {
    try {
        const list = getListCollection().findOne({ ethAddress: ethAddress, id: id });
        list['entryIds'] = list.entryIds || [];
        const entry = list.entryIds.find(ele => ele.entryId === entryId);
        if (!entry) {
            list.entryIds.push({ entryId, entryType, authorEthAddress });
        } else if (entry) {
            // Otherwise if entryId is already added, it should be removed
            list.entryIds = list.entryIds.filter(ele => ele.entryId !== entryId);
        }
        getListCollection().findAndUpdate({ ethAddress: ethAddress, id: id }, rec =>
            Object.assign(rec, list)
        );
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb)).then(() => Object.assign({}, list));
    } catch (error) {
        return Promise.reject(error);
    }
};
