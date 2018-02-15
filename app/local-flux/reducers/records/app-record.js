import { List, Map, Record } from 'immutable';

export const NotificationRecord = Record({
    id: null,
    duration: null,
    type: null,
    displayId: null,
    values: new Map(),
});

export const PreviewRecord = Record({
    type: null,
    value: null
});

export const AppRecord = Record({
    appReady: false,
    homeReady: false,
    isLightSync: false,
    notifications: new List(),
    navigationBackCounter: 0,
    navigationForwardCounter: 0,
    displayedNotifications: new List(),
    fullSizeImages: new Map(),
    outsideNavigation: new Map({
        url: null,
        isVisible: false,
        isTrusted: false
    }),
    showGethDetailsModal: false,
    showIpfsDetailsModal: false,
    showNavigationModal: false,
    showNotificationsPanel: false,
    showPreview: null,
    showProfileEditor: false,
    showReportModal: null,
    showSecondarySidebar: false, // must default to false
    showTerms: false,
    showTransactionsLog: false,
    showWallet: null,
});
