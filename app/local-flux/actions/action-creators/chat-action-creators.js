import * as types from '../../constants/ChatConstants';

export function getJoinedChannelsSuccess (data) {
    return {
        type: types.GET_JOINED_CHANNELS_SUCCESS,
        data
    };
}

export function getJoinedChannelsError (error) {
    return {
        type: types.GET_JOINED_CHANNELS_ERROR,
        error
    };
}

export function getRecentChannelsSuccess (data) {
    return {
        type: types.GET_RECENT_CHANNELS_SUCCESS,
        data
    };
}

export function getRecentChannelsError (error) {
    return {
        type: types.GET_RECENT_CHANNELS_ERROR,
        error
    };
}

export function saveChannelSuccess (data) {
    return {
        type: types.SAVE_CHANNEL_SUCCESS,
        data
    };
}

export function saveChannelError (error) {
    return {
        type: types.SAVE_CHANNEL_ERROR,
        error
    };
}

export function deleteChannelSuccess (data) {
    return {
        type: types.DELETE_CHANNEL_SUCCESS,
        data
    };
}

export function deleteChannelError (error) {
    return {
        type: types.DELETE_CHANNEL_ERROR,
        error
    };
}

export function saveRecentChannelSuccess (data, flags) {
    return {
        type: types.SAVE_RECENT_CHANNEL_SUCCESS,
        data,
        flags
    };
}

export function saveRecentChannelError (error) {
    return {
        type: types.SAVE_RECENT_CHANNEL_ERROR,
        error
    };
}

export function deleteRecentChannelSuccess (data, flags) {
    return {
        type: types.DELETE_RECENT_CHANNEL_SUCCESS,
        data,
        flags
    };
}

export function deleteRecentChannelError (error) {
    return {
        type: types.DELETE_RECENT_CHANNEL_ERROR,
        error
    };
}

export function getCurrentChannelsSuccess (data) {
    return {
        type: types.GET_CURRENT_CHANNELS_SUCCESS,
        data
    };
}

export function getCurrentChannelsError (error) {
    return {
        type: types.GET_CURRENT_CHANNELS_ERROR,
        error
    };
}

export function setActiveChannel (channel, flags) {
    return {
        type: types.SET_ACTIVE_CHANNEL,
        channel,
        flags
    };
}
