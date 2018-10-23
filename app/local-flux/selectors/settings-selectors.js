export const selectGeneralSettings = state => state.settingsState.get('general');
export const selectUserSettings = state => state.settingsState.get('userSettings');

export const getNotificationsPreference = state =>
    selectUserSettings(state).get('notificationsPreference');

export const getEntryContentHidden = state =>
    selectUserSettings(state).get('hideEntryContent');

export const selectHideCommentSettings = state =>
    state.settingsState.getIn(['userSettings', 'hideCommentContent']);