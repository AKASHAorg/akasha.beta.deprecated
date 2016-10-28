/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record"] }]*/
import { fromJS, List, Record } from 'immutable';
import { createReducer } from './create-reducer';
import * as types from '../constants/DraftConstants';

const ErrorRecord = Record({
    code: '',
    message: null,
    fatal: false
});

const Draft = Record({
    id: null,
    content: {},
    authorUsername: null,
    title: '',
    wordCount: 0,
    excerpt: null,
    featured_image: null,
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
    savingDraft: false,
    draftsCount: 0,
    fetchingDraftsCount: false
});
/**
 * State of the entries and drafts
 */
const draftState = createReducer(initialState, {
    [types.SAVE_DRAFT]: state =>
        state.merge({ savingDraft: true }),

    [types.CREATE_DRAFT_SUCCESS]: (state, action) => {
        const draft = new Draft(action.draft);
        return state.merge({
            drafts: state.get('drafts').push(draft),
            savingDraft: false
        });
    },

    [types.CREATE_DRAFT_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.GET_DRAFTS_SUCCESS]: (state, action) => {
        const drafts = new List(action.drafts.map(draft => new Draft(draft)));
        return state.merge({
            drafts: state.get('drafts').concat(drafts)
        });
    },
    [types.GET_DRAFT_BY_ID_SUCCESS]: (state, { draft }) => {
        const draftIndex = state.get('drafts').findIndex(drft => drft.id === draft.id);
        if (draftIndex > -1) {
            return state.mergeIn(['drafts', draftIndex], new Draft(draft));
        }
        return state.merge({
            drafts: state.get('drafts').push(new Draft(draft))
        });
    },
    [types.UPDATE_DRAFT_SUCCESS]: (state, action) => {
        const draftIndex = state.get('drafts').findIndex(draft =>
            draft.id === action.draft.id
        );
        const newState = state.merge({
            drafts: state.get('drafts').mergeIn([draftIndex], action.draft),
            savingDraft: false
        });
        return newState;
    },

    [types.GET_DRAFTS_COUNT]: state =>
        state.set('fetchingDraftsCount', true),

    [types.GET_DRAFTS_COUNT_SUCCESS]: (state, action) =>
        state.merge({
            draftsCount: action.count,
            fetchingDraftsCount: false
        }),

    [types.GET_PUBLISHING_DRAFTS_SUCCESS]: (state, { drafts }) =>
        state.merge({
            drafts: state.get('drafts').concat(drafts.map(drft => new Draft(drft)))
        }),

    [types.GET_PUBLISHING_DRAFTS_ERROR]: (state, error) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),
});

export default draftState;
