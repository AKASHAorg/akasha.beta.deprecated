import entriesDB from './db/entry';


class DraftService {
    constructor () {
        this.listeners = {};
    }

    saveDraft = partialDraft =>
        entriesDB.transaction('rw', entriesDB.drafts, () => {
            const { id, status, ...other } = partialDraft;
            if (id) {
                entriesDB.drafts.where('id').equals(id).modify({ status, ...other });
                return partialDraft;
            }
            return entriesDB.drafts.add(partialDraft).then(() =>
                partialDraft
            );
        });

    deleteDraft = ({ draftId, onSuccess, onError }) => {
        entriesDB.transaction('rw', entriesDB.drafts, () => {
            entriesDB.drafts.where('id').equals(draftId).delete();
        })
        .then(() => onSuccess(draftId))
        .catch(reason => onError(reason));
    }

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
    getDraftsCount = ({ profile, onSuccess, onError }) => {
        entriesDB.transaction('rw', entriesDB.drafts, () =>
            entriesDB.drafts
                .where('profile')
                .equals(profile)
                .count()
        )
        .then(counter => onSuccess(counter))
        .catch(error => onError(error));
    }

    // get draft by id;
    getById = ({ id, onSuccess, onError }) =>
        entriesDB.transaction('r', entriesDB.drafts, () =>
            entriesDB.drafts
                .where('id')
                .equals(id)
                .first()
        )
        .then(result => onSuccess(result))
        .catch(reason => onError(reason));

    getPublishingDrafts = ({ profile, onSuccess, onError }) =>
        entriesDB.transaction('r', entriesDB.drafts, () =>
            entriesDB.drafts
                .where('profile')
                .equals(profile)
                .and(val =>
                    val.status.publishing === true &&
                        val.status.publishingConfirmed === true
                )
                .toArray()
        )
        .then(results => onSuccess(results))
        .catch(reason => onError(reason))
}

export { DraftService };
