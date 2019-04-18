import { Map, OrderedMap, Record } from 'immutable';
import { DraftJS } from 'megadraft';
import { License } from './license-state-model';

const { EditorState } = DraftJS;

export const CardInfo = Record({
    title: '',
    description: '',
    image: new Map(),
    bgColor: null,
    url: '',
});

export const MetaInfo = Record({
    created: null,
    updated: null
});
/**
 * Draft/Entry types => article, link, image, video, book, etc..
 * defaults to article
 */

export const DraftContent = Record({
    cardInfo: CardInfo(),
    draft: EditorState.createEmpty(),
    excerpt: '',
    entryType: 'article',
    featuredImage: Map(),
    licence: License(),
    title: '',
    wordCount: 0,
    version: -1,
    latestVersion: -1,
});

export const DraftsIterator = Record({
    lastBlock: undefined,
    lastIndex: undefined,
    moreEntries: null,
    totalLoaded: 0,
});

export const Draft = Record({
    /**
     * published entry fields
     */
    active: false,
    baseUrl: '',
    commentsCount: 0,
    entryEth: new Map(),
    score: '',
    /**
     * Draft + published fields
     */
    ethAddress: null,
    hasCard: false,
    onChain: false,
    content: new DraftContent(),
    id: null,
    publishing: false,
    saved: false,
    saving: false,
    localChanges: false,
    tags: new OrderedMap(),
    meta: new MetaInfo()
});

export default class DraftStateModel extends Draft {

    determineEntryType (content) {
        if (content.cardInfo && content.cardInfo.url) {
            return 'link';
        }
        return 'article';
    }

    sortByDate (drafts, list) {
        return list.sort((a, b) => {
            const draftA = drafts.get(a);
            const draftB = drafts.get(b);
            const timestampA = draftA.getIn(['meta', 'updated']) || draftA.getIn(['meta', 'created']);
            const timestampB = draftB.getIn(['meta', 'updated']) || draftB.getIn(['meta', 'created']);
            if (!timestampA) {
                return -1;
            }
            if (new Date(timestampA) > new Date(timestampB)) {
                return -1;
            }
            if (new Date(timestampA) < new Date(timestampB)) {
                return 1;
            }
            return 0;
        });
    }

    createDraft (draftObj) {
        const { selectionState, ...others } = draftObj; // eslint-disable-line
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

    addExistingTags (tags) {
        let orderedTags = new OrderedMap();
        tags.forEach((tag) => {
            orderedTags = orderedTags.set(tag, { exists: true });
        });
        return orderedTags;
    }
}
