import { List, Map, Record } from 'immutable';

export const NotificationRecord = Record({
    id: null,
    duration: null,
    values: new Map(),
});

export const PendingActionRecord = Record({
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
    homeReady: false,
    notifications: new List(),
    pendingActions: new Map(),
    publishConfirmDialog: null,
    showAuthDialog: null,
    showGethDetailsModal: false,
    showIpfsDetailsModal: false,
    showLoginDialog: null,
    showReportModal: null,
    showTerms: false,
    timestamp: 0,
    transferConfirmDialog: null,
    weightConfirmDialog: null,
});

export default AppRecord;
