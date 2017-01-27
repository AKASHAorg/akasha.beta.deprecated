/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record", "Map"] }]*/
import { fromJS, Record, List } from 'immutable';
import * as types from '../constants/ChatConstants';
import * as appTypes from '../constants/AppConstants';
import { createReducer } from './create-reducer';

const ErrorRecord = Record({
    code: '',
    message: null,
    fatal: false
});

const initialState = fromJS({
    activeChannel: '',
    errors: new List(),
    flags: {},
    joinedChannels: new List(),
    recentChannels: new List()
});

const errorHandler = (state, { error }) =>
    state.merge({
        errors: state.get('errors').push(new ErrorRecord(error))
    });

const chatState = createReducer(initialState, {
    [types.GET_JOINED_CHANNELS_SUCCESS]: (state, { data }) =>
        state.merge({
            joinedChannels: state.get('joinedChannels').concat(new List(data))
        }),

    [types.GET_JOINED_CHANNELS_ERROR]: errorHandler,

    [types.GET_RECENT_CHANNELS_SUCCESS]: (state, { data }) =>
        state.merge({
            recentChannels: new List(data)
        }),

    [types.GET_RECENT_CHANNELS_ERROR]: errorHandler,

    [types.SAVE_CHANNEL_SUCCESS]: (state, { data }) =>
        state.merge({
            joinedChannels: state.get('joinedChannels').push(data)
        }),

    [types.SAVE_CHANNEL_ERROR]: errorHandler,

    [types.DELETE_CHANNEL_SUCCESS]: (state, { data }) => {
        const index = state.get('joinedChannels').indexOf(data);
        if (index === -1) {
            return state;
        }
        return state.merge({
            joinedChannels: state.get('joinedChannels').delete(index)
        });
    },

    [types.DELETE_CHANNEL_ERROR]: errorHandler,

    [types.SAVE_RECENT_CHANNEL_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            recentChannels: new List(data),
            flags: state.get('flags').merge(flags)
        }),

    [types.SAVE_RECENT_CHANNEL_ERROR]: errorHandler,

    [types.DELETE_RECENT_CHANNEL_SUCCESS]: (state, { data }) => {
        const index = state.get('recentChannels').indexOf(data);
        if (index === -1) {
            return state;
        }
        return state.merge({
            recentChannels: state.get('recentChannels').delete(index)
        });
    },

    [types.DELETE_RECENT_CHANNEL_ERROR]: errorHandler,

    [types.GET_CURRENT_CHANNELS_SUCCESS]: (state, { data }) =>
        state.merge({
            joinedChannels: state.get('joinedChannels').unshift(data.channels[0])
        }),

    [types.GET_CURRENT_CHANNELS_ERROR]: errorHandler,

    [types.SET_ACTIVE_CHANNEL]: (state, { channel, flags }) =>
        state.merge({
            activeChannel: channel,
            flags: state.get('flags').merge(flags)
        }),

    [appTypes.CLEAN_STORE]: () => initialState,
});

export default chatState;
