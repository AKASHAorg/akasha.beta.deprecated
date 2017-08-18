import highlightDB from './db/highlight';

export const saveHighlight = highlight =>
    new Promise((resolve, reject) => {
        const timestamp = new Date().getTime();
        highlight.timestamp = timestamp;
        highlight.id = `${timestamp}-${highlight.account}`;
        highlightDB.highlights.put(highlight)
            .then(() => resolve(highlight))
            .catch(err => reject(err));
    });
