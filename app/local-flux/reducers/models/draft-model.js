import { Record, Map, List, fromJS } from 'immutable';
import { DraftLicence, DraftContent, Draft, EntryEth } from '../records';

const DraftModelRecord = Record({
    drafts: new Map(),
    draftsCount: 0,
    publishedEntries: new Map(),
    selection: new Map(),
    draftsFetched: false,
    entriesFetched: false,
    resolvingHashes: new List(),
});

export default class DraftModel extends DraftModelRecord {
    static createDraft (draftObj) {
        const { selectionState, ...others } = draftObj;
        const draftLicence = new DraftLicence(draftObj.content.licence);
        const entryEth = new EntryEth(draftObj.entryEth);
        const draftContent = new DraftContent({
            ...draftObj.content,
            licence: draftLicence,
            featuredImage: draftObj.featuredImage ? draftObj.featuredImage : new Map()
        });
        const draft = new Draft({
            ...others,
            akashaId: draftObj.akashaId || draftObj.entryEth.publisher.akashaId,
            id: draftObj.id ? draftObj.id : draftObj.entryId,
            licence: draftLicence,
            content: draftContent,
            entryEth,
            tags: (draftObj.tags && draftObj.tags.length) ? List.of(...draftObj.tags) : new List(),
        });
        return draft;
    }
}
