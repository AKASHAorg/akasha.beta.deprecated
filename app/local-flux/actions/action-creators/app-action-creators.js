import * as types from '../../constants/AppConstants';

export function showError (error) {
    return {
        type: types.SHOW_ERROR,
        error
    };
}

export function checkForUpdates (hasUpdates) {
    return {
        type: types.CHECK_FOR_UPDATES,
        hasUpdates
    };
}

export function clearError () {
    return { type: types.CLEAR_ERRORS };
}

export function showPanel (panel) {
    return {
        type: types.SHOW_PANEL,
        panel
    };
}

export function hidePanel (panel) {
    return {
        type: types.HIDE_PANEL,
        panel
    };
}

export function showAuthDialog (actionId) {
    return {
        type: types.SHOW_AUTH_DIALOG,
        actionId
    };
}

export function hideAuthDialog () {
    return {
        type: types.HIDE_AUTH_DIALOG
    };
}

export function showPublishConfirmDialog (resource) {
    return {
        type: types.SHOW_PUBLISH_CONFIRM_DIALOG,
        resource
    };
}

export function hidePublishConfirmDialog () {
    return {
        type: types.HIDE_PUBLISH_CONFIRM_DIALOG
    };
}

export function showEntryModal (entryData) {
    return {
        type: types.SHOW_ENTRY_MODAL,
        entryData
    };
}

export function hideEntryModal () {
    return {
        type: types.HIDE_ENTRY_MODAL
    };
}

export function showWeightConfirmDialog (resource) {
    return {
        type: types.SHOW_WEIGHT_CONFIRM_DIALOG,
        resource
    };
}

export function hideWeightConfirmDialog () {
    return {
        type: types.HIDE_WEIGHT_CONFIRM_DIALOG
    };
}

export function castUpvoteError (error) {
    return {
        type: types.CAST_UPVOTE_ERROR,
        error
    };
}

export function castUpvoteSuccess (data) {
    return {
        type: types.CAST_UPVOTE_SUCCESS,
        data
    };
}

export function setTimestamp (timestamp) {
    return {
        type: types.SET_TIMESTAMP,
        timestamp
    };
}

export function showNotification (notification) {
    return {
        type: types.SHOW_NOTIFICATION,
        notification
    };
}

export function hideNotification (notification) {
    return {
        type: types.HIDE_NOTIFICATION,
        notification
    };
}

export function addPendingAction (data) {
    return {
        type: types.ADD_PENDING_ACTION,
        data
    };
}

export function updatePendingAction (data) {
    return {
        type: types.UPDATE_PENDING_ACTION,
        data
    };
}

export function deletePendingAction (actionId) {
    return {
        type: types.DELETE_PENDING_ACTION,
        actionId
    };
}
