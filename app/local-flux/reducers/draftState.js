/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record"] }]*/
import { fromJS, List, Record, Map } from 'immutable';
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
    licence: null,
    status: {
        created_at: '',
        updated_at: '',
        tagsPublished: false,
        publishing: false,
        publishingConfirmed: false,
        currentAction: null
    }
});

const initialState = fromJS({
    drafts: new List(),
    errors: new List(),
    flags: new Map(),
    draftsCount: 0
});
/**
 * State of the entries and drafts
 */
const draftState = createReducer(initialState, {
    [types.SAVE_DRAFT]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.CREATE_DRAFT_SUCCESS]: (state, { draft, flags }) => {
        const drft = new Draft(draft);
        return state.merge({
            drafts: state.get('drafts').push(drft),
            flags: state.get('flags').merge(flags)
        });
    },

    [types.CREATE_DRAFT_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.GET_DRAFTS_SUCCESS]: (state, { drafts, flags }) => {
        const drfts = new List(drafts.map(draft => new Draft(draft)));
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

    [types.GET_DRAFT_BY_ID_SUCCESS]: (state, { draft }) => {
        const draftIndex = state.get('drafts').findIndex(drft => drft.id === draft.id);
        if (draftIndex > -1) {
            return state.mergeIn(['drafts', draftIndex], new Draft(draft));
        }
        return state.merge({
            drafts: state.get('drafts').push(new Draft(draft))
        });
    },
    [types.UPDATE_DRAFT_SUCCESS]: (state, { draft, flags }) => {
        const draftIndex = state.get('drafts').findIndex(drft =>
            drft.id === draft.id
        );
        console.log('updating draft in reducer', draft);
        return state.merge({
            drafts: state.get('drafts').mergeIn([draftIndex], new Draft(draft)),
            flags: state.get('flags').merge(flags)
        });
    },

    [types.UPDATE_DRAFT_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
        }),

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
            drafts: new List(drafts.map(drft => new Draft(drft))),
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_PUBLISHING_DRAFTS_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
        }),
});

export default draftState;
