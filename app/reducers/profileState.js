import * as types from '../constants/ProfileConstants';
import { fromJS, List } from 'immutable';

const initialState = fromJS({
    profiles: List(),
    loggedProfile: {},
    newProfile: {},
    messages: ''
});


export default function profileState (state = initialState, action) {
    switch (action.type) {
        case types.GET_PROFILES_LIST_SUCCESS:
            return state.merge({ profiles: action.profiles });
        case types.GET_PROFILES_LIST_ERROR:
            return state.merge({ profiles: [], messages: action.message });
        case types.AUTH_LOGIN:
            return state.merge({
                authAddress: 'stub'
            });
        case types.AUTH_LOGIN_SUCCESS:
            return state.merge({
                authAddress: 'stub'
            });
        case types.AUTH_LOGIN_FAILURE:
            return state.merge({
                authAddress: 'stub'
            });
        default:
            return state;
    }
}
