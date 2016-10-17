import { fromJS } from 'immutable';
import * as types from '../constants/TagConstants';
import { createReducer } from './create-reducer';

const initialState = fromJS({
    tagsCount: 0,
    isLoading: false
});

const tagState = createReducer(initialState, {
    [types.GET_TAGS]: state =>
        state.merge({
            isLoading: true,
        }),

    [types.GET_TAGS_SUCCESS]: (state, action) =>
        state.merge({
            tagsCount: state.get('tagsCount') + action.tags.length,
            isLoading: false
        }),
    // [types.GET_TAGS_ERROR]: (state, action) => {
    //     return state;
    // },
});

export default tagState;
