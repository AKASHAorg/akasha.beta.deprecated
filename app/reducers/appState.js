import * as types from '../constants/AppConstants';
import { fromJS } from 'immutable';

const initialState = fromJS({
    error: []
});


export default function appState (state = initialState, action) {
    switch (action.type) {
        case types.SHOW_ERROR:
            return state.merge({ error: action.error });
        case types.CLEAR_ERRORS:
            return initialState;
        default:
            return state;
    }
}
