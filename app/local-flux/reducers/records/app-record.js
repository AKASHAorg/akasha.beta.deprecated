import { List, Record } from 'immutable';

export const Notification = Record({
    id: null,
    values: new Map(),
    duration: null
});

export const PendingAction = Record({
    id: null,
    type: null,
    payload: new Map(),
    titleId: null,
    messageId: null,
    gas: null,
    status: null
});

const AppRecord = Record({
    appReady: false,
    showAuthDialog: null,
    showGethDetailsModal: false,
    showIpfsDetailsModal: false,
    showTerms: false,
    weightConfirmDialog: null,
    timestamp: 0,
    notifications: new List(),
    pendingActions: new List(),
    publishConfirmDialog: null,
    transferConfirmDialog: null
});

export default AppRecord;
