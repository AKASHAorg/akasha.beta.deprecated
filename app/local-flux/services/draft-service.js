import entriesDB from './db/entry';


class DraftService {
    constructor () {
        this.listeners = {};
    }
    saveDraft = partialDraft =>
        entriesDB.transaction('rw', entriesDB.drafts, () => {
            const { id, ...other } = partialDraft;
            if (id) {
                return entriesDB.drafts.update(id, other).then((updated) => {
                    if (updated) {
                        return partialDraft;
                    }
                    return null;
                });
            }
            return entriesDB.drafts.add(partialDraft).then(() =>
                partialDraft
            );
        });

    getAllDrafts = username =>
        entriesDB.transaction('rw', entriesDB.drafts, () =>
            entriesDB.drafts
                     .where('username')
                     .equals(username)
                     .toArray()
                     .then((drafts) => {
                         const convDrafts = drafts.map(draft =>
                             Object.assign({}, draft)
                         );
                         return convDrafts;
                     })
        );
    getDraftsCount = ({ username, onSuccess, onError }) =>
        entriesDB.transaction('rw', entriesDB.drafts, () =>
            entriesDB.drafts.where('username').equals(username).count()
        )
        .then(counter => onSuccess(counter))
        .catch(error => onError(error));
    // get resource by id (drafts or entries);
    getById = (table, id) =>
        entriesDB.transaction('r', entriesDB[table], () =>
            entriesDB[table]
                .where('id')
                .equals(parseInt(id, 10))
                .first()
        );
}

export { DraftService };
