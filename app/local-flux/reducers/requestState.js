import { createReducer } from './utils';
import RequestStateModel from './state-models/request-state-model';

const initialState = new RequestStateModel();

const requestState = createReducer(initialState, {
    GENERIC_REQUEST_START: (state, action) =>
        state.merge({
            requstedActions: state.get('requestedActions').concat([action.type])
        }),
    GENERIC_REQUEST_START_ERROR: (state, action) => state.setIn(['errorActions', action.type]),
    GENERIC_REQUEST_END_SUCCESS: (state, action) =>
        state.merge({
            successActions: state.get('successActions').concat([action.type])
        }),
    GENERIC_REQUEST_END_ERROR: (state, action) => state.setIn(['errorActions', action.payload.actionType])
});

export default requestState;
