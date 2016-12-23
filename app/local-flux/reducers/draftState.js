/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record"] }]*/
import { fromJS, List, Record, Map, Set } from 'immutable';
import { createReducer } from './create-reducer';
import * as types from '../constants/DraftConstants';

const ErrorRecord = Record({
    code: '',
    message: null,
    fatal: false
});

const DraftLicence = Record({
    parent: '2',
    id: '4'
});

const DraftContent = Record({
    draft: null,
    title: '',
    excerpt: '',
    wordCount: 0,
    licence: new DraftLicence()
});


const Draft = Record({
    id: null,
    content: new DraftContent(),
    tags: new List(),
    akashaId: null,
    tx: null,
    created_at: null,
    updated_at: null
});

const initialState = fromJS({
    drafts: new List(),
    errors: new List(),
    flags: new Map(),
    draftsCount: 0
});

const createDraftRecord = (draftObj) => {
    const { content = {}, tags, id, akashaId, tx, created_at, updated_at } = draftObj;
    const { title, excerpt, licence, draft, wordCount, featuredImage } = content;
    const createdDraft = new Draft({
        id,
        akashaId,
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
        tags: fromJS(tags)
    });
    return createdDraft;
};
const publishDraftHandler = (state, { flags }) => {
    const publishPendingDrafts = state.getIn(['flags', 'publishPendingDrafts']);
    if (publishPendingDrafts === undefined) {
        return state.merge({
            flags: state.get('flags').set('publishPendingDrafts', new List([flags.publishPending]))
        });
    }
    const index = publishPendingDrafts.findIndex(flag =>
        flag.draftId === flags.publishPending.draftId);
    if (index === -1) {
        return state.merge({
            flags: state.get('flags').merge({
                publishPendingDrafts: state.getIn(['flags', 'publishPendingDrafts'])
                    .push(flags.publishPending)
            })
        });
    }
    return state.merge({
        flags: state.get('flags').mergeIn(['publishPendingDrafts', index], flags.publishPending)
    });
};
const draftState = createReducer(initialState, {
    [types.SAVE_DRAFT]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.CREATE_DRAFT_SUCCESS]: (state, { draft, flags }) => {
        const drft = createDraftRecord(draft);
        return state.merge({
            drafts: state.get('drafts').push(drft),
            draftsCount: state.get('draftsCount') + 1,
            flags: state.get('flags').merge(flags)
        });
    },

    [types.CREATE_DRAFT_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.GET_DRAFTS]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_DRAFTS_SUCCESS]: (state, { drafts, flags }) => {
        const drfts = new List(drafts.map(draft => createDraftRecord(draft)));
        return state.merge({
            drafts: drfts,
            flags: state.get('flags').merge(flags)
        });
    },

    [types.GET_DRAFTS_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
        }),

    [types.PUBLISH_DRAFT]: publishDraftHandler,
    [types.PUBLISH_DRAFT_SUCCESS]: publishDraftHandler,

    [types.PUBLISH_DRAFT_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.GET_DRAFT_BY_ID_SUCCESS]: (state, { draft }) => {
        if (!draft) return state;
        const draftIndex = state.get('drafts').findIndex(drft => drft.id === draft.id);
        if (draftIndex > -1) {
            return state.mergeIn(['drafts', draftIndex], createDraftRecord(draft));
        }
        return state.merge({
            drafts: state.get('drafts').push(createDraftRecord(draft))
        });
    },

    [types.UPDATE_DRAFT_SUCCESS]: (state, { draft, flags }) => {
        const draftIndex = state.get('drafts').findIndex(drft =>
            drft.id === draft.id
        );
        let updatedDraft = state.getIn(['drafts', draftIndex]).mergeDeep(draft);
        if (draft.tags) {
            updatedDraft = updatedDraft.set('tags', draft.tags);
        }
        return state.merge({
            drafts: state.get('drafts').setIn([draftIndex], createDraftRecord(updatedDraft.toJS())),
            flags: state.get('flags').merge(flags)
        });
    },

    [types.UPDATE_DRAFT_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
        }),

    [types.DELETE_DRAFT_SUCCESS]: (state, { draftId }) => {
        const draftIndex = state.get('drafts').findIndex(drft => drft.id === draftId);
        return state.merge({
            drafts: state.get('drafts').delete(draftIndex)
        });
    },

    [types.GET_DRAFTS_COUNT]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_DRAFTS_COUNT_SUCCESS]: (state, { count, flags }) =>
        state.merge({
            draftsCount: count,
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_PUBLISHING_DRAFTS]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_PUBLISHING_DRAFTS_SUCCESS]: (state, { drafts, flags }) =>
        state.merge({
            drafts: state.get('drafts').toSet().union(new Set(drafts.map(drft =>
                createDraftRecord(drft)))).toList(),
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_PUBLISHING_DRAFTS_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
        }),

    [types.CLEAR_DRAFT_STATE]: state => initialState,
});

export default draftState;
