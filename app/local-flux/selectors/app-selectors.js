// @flow

export const selectNotificationsPanel = (state/*: Object*/) => state.appState.get('showNotificationsPanel');
export const selectShowWallet = (state/*: Object*/)=> state.appState.get('showWallet');
export const selectShowSecondarySidebar = (state/*: Object*/)=> state.appState.get('showSecondarySidebar');
export const selectTransactionsLog = (state/*: Object*/)=> state.appState.get('showTransactionsLog');
export const selectProfileEditToggle = (state/*: Object*/)=> state.appState.get('showProfileEditor');
export const selectFullSizeImages = (state/*: Object*/)=> state.appState.get('fullSizeImages');
export const selectNotifications = (state/*: Object*/) => state.appState.get('notifications');
export const selectDisplayedNotifications = (state/*: Object*/) => state.appState.get('displayedNotifications');
export const selectShowPreview = (state/*: Object*/)=> state.appState.get('showPreview');
export const selectIsLightSync = (state/*: Object*/)=> state.appState.get('isLightSync');
export const selectNavigationForwardCounter = (state/*: Object*/)=> state.appState.get('navigationForwardCounter');
export const selectNavigationBackCounter = (state/*: Object*/)=> state.appState.get('navigationBackCounter');
export const selectHomeReady = (state/*: Object*/)=> state.appState.get('homeReady');
