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
    title: '',
    excerpt: '',
    wordCount: 0,
    licence: new DraftLicence(),
    type: 'article'
});

export const Draft = Record({
    id: null,
    content: new DraftContent(),
    tags: new List(),
    akashaId: null,
    created_at: null,
    updated_at: null,
    saved: false,
    saving: true,
});
