import { Record, Map, List } from 'immutable';
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
        const entryEth = new EntryEth(draftObj.entryEth);
        let draftLicence = new DraftLicence();
        let draftContent = new DraftContent();
        let tags = new List();
        if (draftObj.content) {
            draftLicence = draftLicence.merge(draftObj.content.licence);
            draftContent = draftContent.mergeDeep({
                ...draftObj.content,
                licence: draftLicence,
                featuredImage: draftObj.featuredImage ? draftObj.featuredImage : new Map()
            });
        }
        if (draftObj.tags && draftObj.tags.length) {
            tags = tags.concat(draftObj.tags);
        }
        const draft = new Draft({
            ...others,
            ethAddress: draftObj.ethAddress || draftObj.entryEth.publisher.ethAddress,
            id: draftObj.id ? draftObj.id : draftObj.entryId,
            licence: draftLicence,
            content: draftContent,
            entryEth,
            tags,
        });
        return draft;
    }
}
