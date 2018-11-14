import { createReducer } from './create-reducer';

const initialState = {};

const requestState = createReducer(initialState, {
    'GENERIC_REQUEST_SUCCESS': (state, payload) => state,
    'GENERIC_REQUEST_ERROR': (state, payload) => state,
    'GENERIC_REQUEST_END_SUCCESS': (state, payload) => state,
});

export default requestState;
