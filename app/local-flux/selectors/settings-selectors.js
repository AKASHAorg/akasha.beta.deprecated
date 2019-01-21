// @flow

/** slices */
export const selectGeneralSettings = (state/*: Object */) => state.settingsState.get('general');
export const selectUserSettings = (state/*: Object */) => state.settingsState.get('userSettings');
export const selectSettingsFlags = (state/*: Object */) => state.settingsState.get('flags');
export const selectDefaultGethSettings = (state/*: Object */) =>
    state.settingsState.get('defaultGethSettings');
export const selectDefaultIpfsSettings = (state/*: Object */) =>
    state.settingsState.get('defaultIpfsSettings');
export const selectGethSettings = (state/*: Object */) => state.settingsState.get('geth');
export const selectIpfsSettings = (state/*: Object */) => state.settingsState.get('ipfs');

/** Combos */
export const getNotificationsPreference = (state/*: Object */) =>
    selectUserSettings(state).get('notificationsPreference');

export const getPasswordPreference = (state/*: Object */) =>
    selectUserSettings(state).get('passwordPreference');

export const getEntryContentHidden = (state/*: Object */) =>
    selectUserSettings(state).get('hideEntryContent');

export const getHideCommentSettings = (state/*: Object */) =>
    selectUserSettings(state).get('hideCommentContent');

export const getHideEntrySettings = (state/*: Object */) => selectUserSettings(state).get('hideEntryContent');

export const getUserDefaultLicence = (state/*: Object */) => selectUserSettings(state).get('defaultLicence');

export const getThemeSettings = (state/*: Object */) => selectGeneralSettings(state).get('darkTheme');

export const getConfigurationSaved = (state/*: Object */) =>
    selectGeneralSettings(state).get('configurationSaved');

export const getSavingUserSettings = (state/*: Object */) =>
    selectSettingsFlags(state).get('savingUserSettings');

export const getGethSyncModeSettings = (state/*: Object */) => selectGethSettings(state).get('syncmode');
