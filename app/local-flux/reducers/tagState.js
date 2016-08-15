import * as types from '../constants/TagConstants';
import { createReducer } from './create-reducer';
import { fromJS, List } from 'immutable';

const initialState = fromJS({
    tags: List(),
    isLoading: false
});

const tagState =  createReducer(initialState, {
    [types.GET_TAGS]: (state) => {
        return state.merge({
            isLoading: true,
        });
    },
    [types.GET_TAGS_SUCCESS]: (state, action) => {
        return state.merge({
            tags: state.get('tags').concat(action.tags),
            isLoading: false
        });
    },
    // [types.GET_TAGS_ERROR]: (state, action) => {
    //     return state;
    // },
});

export default tagState;
