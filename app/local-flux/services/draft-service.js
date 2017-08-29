import entriesDB from './db/entry';

export const draftModify = (draft) => {
    const { id, ...changes } = draft;
    return entriesDB.drafts
        .where('id')
        .equals(id)
        .modify(changes)
        .then(() => draft);
};

export const draftCreate = draft =>
    entriesDB.drafts
        .add(draft)
        .then((id) => {
            draft.id = id;
            return draft;
        });

export const draftCreateOrUpdate = ({ draft }) => {
    const { tags, id, akashaId, content } = draft;
    return entriesDB.drafts
        .where('id')
        .equals(draft.id)
        .first()
        .then((draftObj) => {
            if (!draftObj) {
                return draftCreate({
                    tags,
                    id,
                    akashaId,
                    content
                });
            }
            return draftModify({
                tags,
                id,
                akashaId,
                content
            });
        })
        .then(() => entriesDB.drafts.where('id').equals(draft.id).first())
        .catch(ex => console.error(ex, 'the error'));
};

export const draftDelete = ({ draftId }) =>
entriesDB.drafts.where('id')
    .equals(draftId)
    .delete()
    .then(() => draftId)
    .catch(reason => reason);

export const draftsGet = akashaId =>
    entriesDB.drafts
        .where('akashaId')
        .equals(akashaId)
        .toArray();

export const draftGetById = draftId =>
    entriesDB.drafts
        .where('id')
        .equals(draftId)
        .first();

export const draftSave = data =>
    entriesDB.drafts.put(data.draft)
        .then(() => data.draft);

export const draftsGetCount = ({ akashaId }) =>
    entriesDB.drafts
        .where('akashaId')
        .equals(akashaId)
        .count();

