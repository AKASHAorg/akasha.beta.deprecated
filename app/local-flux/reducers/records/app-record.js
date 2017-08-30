import { List, Map, Record } from 'immutable';

export const NotificationRecord = Record({
    id: null,
    duration: null,
    values: new Map(),
});

const AppRecord = Record({
    appReady: false,
    homeReady: false,
    notifications: new List(),
    showAppSettings: false,
    showAuthDialog: null,
    showGethDetailsModal: false,
    showIpfsDetailsModal: false,
    showReportModal: null,
    showSecondarySidebar: true, // must default to true
    showTerms: false,
});

export default AppRecord;
