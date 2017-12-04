import listDB from './db/list';

export const addList = payload =>
    new Promise((resolve, reject) => {
        const timestamp = new Date().getTime();
        payload.timestamp = timestamp;
        payload.id = `${timestamp}-${payload.ethAddress}`;
        listDB.lists.put({ ...payload })
            .then(id => resolve({ id, timestamp }))
            .catch(err => reject(err));
    });

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

export const deleteList = listId =>
    new Promise((resolve, reject) => {
        listDB.lists
            .delete(listId)
            .then(resolve)
            .catch(reject);
    });

export const editList = ({ id, name, description }) =>
    new Promise((resolve, reject) => {
        listDB.lists
            .where('id')
            .equals(id)
            .first()
            .then((data) => {
                data.name = name;
                data.description = description;
                listDB.lists.put(data)
                    .then(() => resolve(data))
                    .catch(err => reject(err));
            });
    });

export const getAllLists = ethAddress =>
    new Promise((resolve, reject) => {
        listDB.lists
            .where('ethAddress')
            .equals(ethAddress)
            .toArray()
            .then(resolve)
            .catch(reject);
    });

export const getList = ({ ethAddress, id }) =>
    new Promise((resolve, reject) => {
        listDB.lists
            .where('[ethAddress+id]')
            .equals([ethAddress, id])
            .first()
            .then(resolve)
            .catch(reject);
    });

export const searchList = ({ ethAddress, search }) =>
    new Promise((resolve, reject) => {
        listDB.lists
            .where('ethAddress')
            .equals(ethAddress)
            .filter((list) => {
                let { name = '', description = '' } = list;
                name = name.toLowerCase();
                description = description.toLowerCase();
                return name.includes(search) || description.includes(search);
            })
            .toArray()
            .then(data => resolve(data.map(list => list.name)))
            .catch(reject);
    });

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

export const toggleEntry = ({ ethAddress, id, entryId, entryType, authorEthAddress }) =>
    new Promise((resolve, reject) => {
        listDB.lists
            .where('[ethAddress+id]')
            .equals([ethAddress, id])
            .toArray()
            .then((data) => {
                const list = data[0];
                // Initialize entryIds with an empty array if it doesn't exist
                list.entryIds = list.entryIds || [];
                const entry = list.entryIds.find(ele => ele.entryId === entryId);
                if (!entry) {
                    list.entryIds.push({ entryId, entryType, authorEthAddress });
                } else if (entry) {
                    // Otherwise if entryId is already added, it should be removed
                    list.entryIds = list.entryIds.filter(ele => ele.entryId !== entryId);
                }

                listDB.lists
                    .put(list)
                    .then(() => resolve(list))
                    .catch(reject);
            })
            .catch(err => reject(err));
    });
