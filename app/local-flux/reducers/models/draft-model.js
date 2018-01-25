import { Record, Map, List, OrderedMap } from 'immutable';
import { License, DraftContent, Draft } from '../records';

const DraftModelRecord = Record({
    drafts: new Map(),
    draftsCount: 0,
    publishedEntries: new Map(),
    selection: new Map(),
    draftsFetched: false,
    entriesFetched: false,
    fetchingDrafts: false,
    resolvingEntries: new List(),
});

export default class DraftModel extends DraftModelRecord {
    static createDraft (draftObj) {
        const { selectionState, ...others } = draftObj;
        let draftLicence = new License();
        let draftContent = new DraftContent();
        let tags = new OrderedMap();
        if (draftObj.content) {
            draftLicence = draftLicence.merge(draftObj.content.licence);
            draftContent = draftContent.mergeDeep({
                ...draftObj.content,
                licence: draftLicence,
                featuredImage: draftObj.content.featuredImage ? draftObj.content.featuredImage : new Map()
            });
        }
        if (draftObj.tags && draftObj.tags.size) {
            tags = tags.merge(draftObj.tags);
        }
        const draft = new Draft({
            ...others,
            ethAddress: draftObj.ethAddress,
            id: draftObj.id ? draftObj.id : draftObj.entryId,
            licence: draftLicence,
            content: draftContent,
            tags,
        });
        return draft;
    }
    static addExistingTags (tags) {
        let orderedTags = new OrderedMap();
        tags.forEach((tag) => {
            orderedTags = orderedTags.set(tag, { exists: true });
        });
        return orderedTags;
    }
}
