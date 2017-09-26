import { Record, List } from 'immutable';
import { DraftJS } from 'megadraft';

const { EditorState } = DraftJS;

export const DraftLicence = Record({
    parent: '2',
    id: '4'
});

/**
 * Draft/Entry types => article, link, image, video, book, etc..
 * defaults to article
 */

export const DraftContent = Record({
    draft: EditorState.createEmpty(),
    excerpt: '',
    featuredImage: new Map(),
    licence: new DraftLicence(),
    title: '',
    wordCount: 0,
    version: -1,
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
    akashaId: null,
    content: new DraftContent(),
    created_at: null,
    id: null,
    publishing: false,
    saved: false,
    saving: false,
    localChanges: false,
    tags: new List(),
    type: 'article',
    updated_at: null,
});
