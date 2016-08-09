import * as types from '../../constants/AppConstants';

export function showError (error) {
    return {
        type: types.SHOW_ERROR,
        error
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
