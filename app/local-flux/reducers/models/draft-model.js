import { Record, Map, List } from 'immutable';
import { DraftLicence, DraftContent, Draft } from '../records';

const DraftModelRecord = Record({
    drafts: new Map(),
    draftsCount: 0,
    selection: new Map(),
    draftsFetched: false,
});

export default class DraftModel extends DraftModelRecord {
    static createDraft (draftObj) {
        const {
            akashaId,
            content = {},
            entryId,
            id,
            tags = null,
            tx, created_at, updated_at } = draftObj;
        const { title, excerpt, licence = new DraftLicence(), draft, wordCount, featuredImage, type } = content;
        const createdDraft = new Draft({
            id,
            akashaId,
            entryId,
            tx,
            created_at,
            updated_at,
            content: new DraftContent({
                type,
                draft,
                title,
                licence: new DraftLicence(licence),
                excerpt,
                featuredImage,
                wordCount
            }),
            tags: new List().concat(tags)
        });
        return createdDraft;
    }
}
