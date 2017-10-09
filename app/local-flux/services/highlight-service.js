import highlightDB from './db/highlight';

export const deleteHighlight = id =>
    new Promise((resolve, reject) => {
        highlightDB.highlights
            .delete(id)
            .then(resolve)
            .catch(reject);
    });

export const editNotes = ({ id, notes }) =>
    new Promise((resolve, reject) => {
        highlightDB.highlights
            .where('id')
            .equals(id)
            .toArray()
            .then((data) => {
                const highlight = data[0];
                if (!highlight) {
                    reject({});
                }
                highlight.notes = notes;
                highlightDB.highlights
                    .put(highlight)
                    .then(() => resolve(highlight))
                    .catch(resolve);
            })
            .catch(reject);
    });

export const getAll = ethAddress =>
    new Promise((resolve, reject) => {
        highlightDB.highlights
            .where('ethAddress')
            .equals(ethAddress)
            .toArray()
            .then(resolve)
            .catch(reject);
    });

export const saveHighlight = highlight =>
    new Promise((resolve, reject) => {
        const timestamp = new Date().getTime();
        highlight.timestamp = timestamp;
        highlight.id = `${timestamp}-${highlight.ethAddress}`;
        highlightDB.highlights.put(highlight)
            .then(() => resolve(highlight))
            .catch(err => reject(err));
    });

export const searchHighlight = ({ ethAddress, search }) =>
    new Promise((resolve, reject) => {
        highlightDB.highlights
            .where('ethAddress')
            .equals(ethAddress)
            .filter((highlight) => {
                let { content = '', notes = '' } = highlight;
                content = content.toLowerCase();
                notes = notes.toLowerCase();
                return content.includes(search) || notes.includes(search);
            })
            .toArray()
            .then(data => resolve(data.map(highlight => highlight.id)))
            .catch(reject);
    });
