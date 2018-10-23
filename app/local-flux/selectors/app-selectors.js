// @flow

export const selectNotificationsPanel = (state/*: Object*/) => state.appState.get('showNotificationsPanel');
export const selectShowWallet = (state/*: Object*/)=> state.appState.get('showWallet');
export const selectTransactionsLog = (state/*: Object*/)=> state.appState.get('showTransactionsLog');
export const selectProfileEditToggle = (state/*: Object*/)=> state.appState.get('showProfileEditor');
