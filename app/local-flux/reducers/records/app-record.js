import { List, Map, Record } from 'immutable';

export const NotificationRecord = Record({
    id: null,
    duration: null,
    type: null,
    displayId: null,
    values: new Map(),
});

const AppRecord = Record({
    appReady: false,
    homeReady: false,
    notifications: new List(),
    displayedNotifications: new List(),
    showAppSettings: false,
    showGethDetailsModal: false,
    showIpfsDetailsModal: false,
    showReportModal: null,
    showTerms: false,
});

export default AppRecord;
