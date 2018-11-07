// @flow

/** slices */
export const selectGeneralSettings = (state/*: Object */) => state.settingsState.get('general');
export const selectUserSettings = (state/*: Object */) => state.settingsState.get('userSettings');

/** Combos */
export const getNotificationsPreference = (state/*: Object */) =>
    selectUserSettings(state).get('notificationsPreference');

export const getEntryContentHidden = (state/*: Object */) =>
    selectUserSettings(state).get('hideEntryContent');

export const getHideCommentSettings = (state/*: Object */) =>
    selectUserSettings(state).get('hideCommentContent');