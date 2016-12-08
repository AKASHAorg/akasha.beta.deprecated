/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record"] }]*/
import { fromJS, List, Record, Map, Set } from 'immutable';
import { createReducer } from './create-reducer';
import * as types from '../constants/DraftConstants';

const ErrorRecord = Record({
    code: '',
    message: null,
    fatal: false
});

const DraftContent = Record({
    entityMap: {},
    blocks: []
});

const DraftLicence = Record({
    parent: '2',
    id: '4'
});

const Draft = Record({
    id: null,
    content: new DraftContent(),
    profile: null,
    title: '',
    wordCount: 0,
    excerpt: null,
    featuredImage: null,
    tags: new List(),
    tx: null,
    licence: new DraftLicence(),
    status: {
        created_at: '',
        updated_at: '',
        publishing: false
    }
});

const initialState = fromJS({
    drafts: new List(),
    errors: new List(),
    flags: new Map(),
    draftsCount: 0
});

const createDraftRecord = (draft) => {
    const { content, tags, licence, ...others } = draft;
    return new Draft({
        content: new DraftContent(content),
        tags: fromJS(tags),
        licence: new DraftLicence(licence),
        ...others
    });
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

    [types.GET_DRAFTS_SUCCESS]: (state, { drafts, flags }) => {
        const drfts = new List(drafts.map(draft => createDraftRecord(draft)));
        return state.merge({
            drafts: drfts,
            flags: state.get('flags').merge(flags)
        });
    },
    [types.PUBLISH_DRAFT]: publishDraftHandler,
    [types.PUBLISH_DRAFT_SUCCESS]: publishDraftHandler,

    [types.PUBLISH_DRAFT_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.GET_DRAFTS_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
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
        const updatedDraft = state.getIn(['drafts', draftIndex]).withMutations((drft) => {
            if (draft.licence) {
                draft.licence = new DraftLicence(draft.licence);
            }
            if (draft.tags) {
                draft.tags = new List(draft.tags);
            }
            drft.merge(draft);
        });
        return state.merge({
            drafts: state.get('drafts').setIn([draftIndex], updatedDraft),
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

    [types.CLEAR_DRAFT_STATE]: (state) => initialState,
});

export default draftState;
