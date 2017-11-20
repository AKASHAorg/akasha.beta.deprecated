import { List, Map, Record } from 'immutable';

export const NotificationRecord = Record({
    id: null,
    duration: null,
    type: null,
    displayId: null,
    values: new Map(),
});

export const AppRecord = Record({
    appReady: false,
    homeReady: false,
    notifications: new List(),
    displayedNotifications: new List(),
    outsideNavigation: new Map({
        url: null,
        isVisible: false,
    }),
    showAppSettings: false,
    showGethDetailsModal: false,
    showIpfsDetailsModal: false,
    showProfileEditor: false,
    showReportModal: null,
    showSecondarySidebar: false, // must default to false
    showTerms: false,
    showWallet: null,
});
