export const selectGeneralSettings = state => state.settingsState.get('general');

export const selectNotificationsPreference = state =>
    state.settingsState.getIn(['userSettings', 'notificationsPreference']);

export const selectHideEntrySettings = state =>
    state.settingsState.getIn(['userSettings', 'hideEntryContent']);
