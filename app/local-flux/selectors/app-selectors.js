export const selectNotificationsPanel = state => state.appState.get('showNotificationsPanel');

export const selectShowWallet = state => state.appState.get('showWallet');

export const selectTransactionsLog = state => state.appState.get('showTransactionsLog');

export const selectProfileEditToggle = state =>
    state.appState.get('showProfileEditor');
