import { fromJS, List, Record } from 'immutable';
import { createReducer } from './create-reducer';
import * as types from '../constants/DraftConstants';

const Draft = Record({
    id: null,
    content: {},
    authorUsername: null,
    title: '',
    wordCount: 0,
    excerpt: null,
    featured_image: null,
    tags: new List(),
    status: {
        created_at: '',
        updated_at: '',
        tagsPublished: false,
        publishing: false
    }
});

const initialState = fromJS({
    drafts: new List(),
    savingDraft: false,
    draftsCount: 0,
});
/**
 * State of the entries and drafts
 */
const draftState = createReducer(initialState, {
    [types.SAVE_DRAFT]: (state) =>
        state.merge({ savingDraft: true }),

    [types.GET_DRAFTS_SUCCESS]: (state, action) => {
        const drafts = new List(action.drafts.map(draft => new Draft(draft)));
        return state.merge({
            drafts: state.get('drafts').concat(drafts)
        });
    },
    [types.CREATE_DRAFT_SUCCESS]: (state, action) => {
        const draft = new Draft(action.draft);
        return state.merge({
            drafts: state.get('drafts').push(draft),
            savingDraft: false
        });
    },
    [types.UPDATE_DRAFT_SUCCESS]: (state, action) => {
        const draftIndex = state.get('drafts').findIndex(draft =>
            draft.id === action.draft.id
        );
        return state.merge({
            drafts: state.updateIn(['drafts', draftIndex], (record) =>
                record.merge(new Map(action.draft))
            ),
            savingDraft: false
        });
    },

    [types.GET_DRAFTS_COUNT_SUCCESS]: (state, action) =>
        state.set('draftsCount', action.count),
});

export default draftState;
