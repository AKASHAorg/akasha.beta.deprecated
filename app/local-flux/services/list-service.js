import listDB from './db/list';

export const addList = payload =>
    new Promise((resolve, reject) => {
        const timestamp = new Date().getTime();
        payload.timestamp = timestamp;
        payload.id = `${timestamp}-${payload.account}`;
        listDB.lists.put({ ...payload })
            .then(id => resolve({ id, timestamp }))
            .catch(err => reject(err));
    });

// export const deleteEntry = ({ account, name, entryId }) =>
//     new Promise((resolve, reject) => {
//         listDB.lists
//             .where('[account+name]')
//             .equals([account, name])
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

export const getAllLists = account =>
    new Promise((resolve, reject) => {
        listDB.lists
            .where('account')
            .equals(account)
            .toArray()
            .then(resolve)
            .catch(reject);
    });

export const getList = ({ account, name }) =>
    new Promise((resolve, reject) => {
        listDB.lists
            .where('[account+name]')
            .equals([account, name])
            .first()
            .then(resolve)
            .catch(reject);
    });

export const searchList = ({ account, search }) =>
    new Promise((resolve, reject) => {
        listDB.lists
            .where('account')
            .equals(account)
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

// export const updateEntryIds = ({ account, listNames, entryId }) =>
//     new Promise((resolve, reject) => {
//         listDB.lists
//             .where('account')
//             .equals(account)
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

export const toggleEntry = ({ account, listName, entryId }) =>
    new Promise((resolve, reject) => {
        listDB.lists
            .where('[account+name]')
            .equals([account, listName])
            .toArray()
            .then((data) => {
                const list = data[0];
                // Initialize entryIds with an empty array if it doesn't exist
                list.entryIds = list.entryIds || [];
                const entryExists = list.entryIds.includes(entryId);

                if (!entryExists) {
                    list.entryIds.push(entryId);
                } else if (entryExists) {
                    // Otherwise if entryId is already added, it should be removed
                    list.entryIds = list.entryIds.filter(id => id !== entryId);
                }

                listDB.lists
                    .put(list)
                    .then(() => resolve(list))
                    .catch(reject);
            })
            .catch(err => reject(err));
    });
