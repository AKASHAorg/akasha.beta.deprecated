import { Record, List, Map } from 'immutable';
import { DraftLicence, DraftContent, Draft } from '../records';

const DraftModelRecord = Record({
    drafts: new Map(),
    draftsCount: 0,
    selection: new Map(),
    draftsFetched: false,
});

export default class DraftModel extends DraftModelRecord {
    static createDraft (draftObj) {
        const { content = {}, tags, id, akashaId, entryId, tx, created_at, updated_at } = draftObj;
        const { title, excerpt, licence, draft, wordCount, featuredImage } = content;
        const createdDraft = new Draft({
            id,
            akashaId,
            entryId,
            tx,
            created_at,
            updated_at,
            content: new DraftContent({
                draft,
                title,
                licence: new DraftLicence(licence),
                excerpt,
                featuredImage,
                wordCount
            }),
            tags: List.of(tags)
        });
        return createdDraft;
    }
}
