import { createReducer } from './utils';
import RequestStateModel from './state-models/request-state-model';

const initialState = new RequestStateModel();

const requestState = createReducer(initialState, {
    'BOOTSTRAP_APP_SUCCESS': (state, action) => {
        return state.merge({
            successActions: state.get('successActions').concat(['BOOTSTRAP_APP'])
        });
    },
    'GENERIC_REQUEST_START': (state, action) => {
        return state.merge({
            requstedActions: state.get('requestedActions').concat([action.type])
        });
    },
    'GENERIC_REQUEST_START_ERROR': (state, action) => {
        return state.setIn(['errorActions', action.type]);
    },
    'GENERIC_REQUEST_END_SUCCESS': (state, action) => {
        return state.merge({
            successActions: state.get('successActions').concat([action.type])
        });
    },
    'GENERIC_REQUEST_END_ERROR': (state, action) => {
        return state.setIn(['errorActions', action.data.actionType]);
    }
});

export default requestState;
