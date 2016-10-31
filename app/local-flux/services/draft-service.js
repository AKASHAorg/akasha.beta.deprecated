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

    getAllDrafts = profile =>
        entriesDB.transaction('rw', entriesDB.drafts, () =>
            entriesDB.drafts
                     .where('profile')
                     .equals(profile)
                     .toArray()
                     .then((drafts) => {
                         const convDrafts = drafts.map(draft =>
                             Object.assign({}, draft)
                         );
                         return convDrafts;
                     })
        );
    getDraftsCount = ({ profile, onSuccess, onError }) =>
        entriesDB.transaction('rw', entriesDB.drafts, () =>
            entriesDB.drafts.where('profile').equals(profile).count()
        )
        .then(counter => onSuccess(counter))
        .catch(error => onError(error));
    // get resource by id (drafts or entries);
    getDraftById = (draftId) =>
        entriesDB.transaction('r', entriesDB[table], () =>
            entriesDB[table]
                .where('id')
                .equals(draftId)
                .first()
        );
    getPublishingDrafts = ({ profile, onSuccess, onError }) =>
        entriesDB.transaction('r', entriesDB.drafts, () => {
            console.log(profile, 'get drafts for profileAddress');
            return entriesDB.drafts
                .where('profile')
                .equals(profile)
                .and((val) => {
                    console.log(val, 'value');
                    return val.status.publishing === true &&
                        val.status.publishingConfirmed === true;
                })
                .toArray()
        })
        .then(results => onSuccess(results))
        .catch(reason => onError(reason))
}

export { DraftService };
