import listDB from './db/list';

export const addEntry = ({ listId, entryId }) =>
    new Promise((resolve, reject) => {
        listDB.lists
            .where('id')
            .equals(listId)
            .toArray()
            .then((lists) => {
                const list = lists[0];
                if (!list) {
                    reject({ message: 'Cannot find selected list' });
                    return;
                }
                list.entryIds = list.entryIds || [];
                if (list.entryIds.indexOf(entryId) !== -1) {
                    reject({ message: 'Entry already added' });
                    return;
                }
                list.entryIds.push(entryId);
                listDB.lists
                    .put(list)
                    .then(() => resolve(list));
            })
            .catch(err => reject(err));
    });

export const addList = payload =>
    new Promise((resolve, reject) => {
        const timestamp = new Date().getTime();
        payload.timestamp = timestamp;
        payload.id = `${timestamp}-${payload.account}`;
        listDB.lists.put({ ...payload })
            .then(id => resolve({ id, timestamp }))
            .catch(err => reject(err));
    });

export const deleteEntry = ({ listId, entryId }) =>
    new Promise((resolve, reject) => {
        listDB.lists
            .where('id')
            .equals(listId)
            .toArray()
            .then((lists) => {
                const list = lists[0];
                if (!list) {
                    reject({ message: 'Cannot find selected list' });
                    return;
                }
                list.entryIds = list.entryIds || [];
                if (list.entryIds.indexOf(entryId) === -1) {
                    reject({ message: 'Cannot find entry' });
                    return;
                }
                list.entryIds = list.entryIds.filter(id => id !== entryId);
                listDB.lists
                    .put(list)
                    .then(() => resolve(list));
            })
            .catch(err => reject(err));
    });

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
