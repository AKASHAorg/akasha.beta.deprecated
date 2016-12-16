import entriesDB from './db/entry';

class DraftService {
    createOrUpdate = (draft) => {
        if (!draft.id) {
            return this.createDraft(draft);
        }
        return this.modifyDraft(draft);
    }

    modifyDraft = (draft) => {
        const { id, ...changes } = draft;
        return entriesDB.drafts
            .where('id')
            .equals(id)
            .modify(changes)
            .then(() => draft);
    }

    createDraft = draft =>
        entriesDB.drafts
            .add(draft)
            .then((id) => {
                draft.id = id;
                return draft;
            });

    saveDraft = partialDraft =>
        entriesDB.drafts.put(partialDraft)
            .then(() => partialDraft);

    deleteDraft = ({ draftId, onSuccess, onError }) =>
        entriesDB.drafts.where('id')
            .equals(draftId)
            .delete()
            .then(() => onSuccess(draftId))
            .catch(reason => onError(reason));

    getAllDrafts = akashaId =>
        entriesDB.drafts
            .where('akashaId')
            .equals(akashaId)
            .toArray()
            .then(drafts =>
                drafts.map(draft =>
                    Object.assign({}, draft)
                )
            );

    getDraftsCount = ({ akashaId, onSuccess, onError }) =>
         entriesDB.drafts
            .where('akashaId')
            .equals(akashaId)
            .count()
            .then(counter => onSuccess(counter))
            .catch(error => onError(error));

    // get draft by id;
    getById = ({ id, onSuccess, onError }) =>
        entriesDB.drafts
            .where('id')
            .equals(id)
            .first()
            .then(result => onSuccess(result))
            .catch(reason => onError(reason));
}

export { DraftService };
