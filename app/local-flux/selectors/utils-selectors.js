// @flow

export const selectUtilsFlags = (state /*: Object */) => state.utilsState.get('flags');

export const getBackupPendingFlag = (state /*: Object */) => selectUtilsFlags(state).get('backupPending');
