import * as types from '../constants/ProfileConstants';
import { fromJS, List, Map } from 'immutable';

const initialState = fromJS({
    profiles: List(),
    loggedProfile: Map(),
    tempProfile: Map({
        firstName: '',
        lastName: '',
        userName: '',
        password: '',
        password2: '',
        address: '',
        optionalData: {
            avatarFile: {},
            backgroundImage: [],
            about: '',
            links: []
        },
        currentStatus: {
            currentStep: '',
            status: '',
            message: '',
            faucetRequested: false
        }
    })
});

export default function profileState (state = initialState, action) {
    switch (action.type) {
        case types.GET_PROFILES_LIST_SUCCESS:
            return state.merge({ profiles: action.profiles });
        case types.GET_PROFILES_LIST_ERROR:
            return state.merge({ profiles: [], messages: action.message });
        case types.GET_TEMP_PROFILE_SUCCESS:
            return state.update('tempProfile', () => Map(action.profile[0]));
        case types.CREATE_ETH_ADDRESS_START:
            return state.updateIn(['tempProfile', 'currentStatus'],
                (cStatus) => Object.assign(cStatus, { status: 'pending' })
            );
        case types.CREATE_ETH_ADDRESS_SUCCESS:
            return state.mergeDeep(fromJS({
                tempProfile: {
                    address: action.data.status,
                    currentStatus: {
                        status: 'finished'
                    }
                }
            }));
        case types.CREATE_ETH_ADDRESS_ERROR:
            return state.updateIn(['tempProfile', 'currentStatus'],
                (cStatus) => Object.assign(cStatus, { status: 'failed' })
            );
        case types.FUND_FROM_FAUCET_START:
            return state.updateIn(['tempProfile', 'currentStatus'],
                (cStatus) => Object.assign(cStatus, { status: 'pending' })
            );
        case types.REQUEST_FUND_FROM_FAUCET_SUCCESS:
            return state.updateIn(['tempProfile', 'currentStatus'],
                (cStatus) => Object.assign(cStatus, { faucetRequested: true })
            );
        case types.FUND_FROM_FAUCET_SUCCESS:
            return state.updateIn(['tempProfile', 'currentStatus'],
                (cStatus) => Object.assign(cStatus, { status: 'finished' })
            );
        case types.FUND_FROM_FAUCET_ERROR:
            return state.updateIn(['tempProfile', 'currentStatus'],
                (cStatus) => Object.assign(cStatus, { status: 'failed' })
            );
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
