import { Record, OrderedMap, Map } from 'immutable';
import { DraftJS } from 'megadraft';
import { License } from './license-record';

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
