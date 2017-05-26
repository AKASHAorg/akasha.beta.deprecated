import { List, Map, Record } from 'immutable';

export const NotificationRecord = Record({
    id: null,
    duration: null,
    values: new Map(),
});

export const PendingActionRecord = Record({
    // specify entity type of the resource that will get published
    // usefull if you want to filter a specific type of entity
    // eg: tempProfile, upvote, comment, downvote, etc
    entityType: null,
    // one of [create, update, delete]
    actionType: null,
    // usefull to create relations between pending action and resource
    entityId: null,
    // status of the pending action (use actionTypes for this field)
    currentAction: null,
    // tx received from main
    publishTx: null,
    // for entities that requires confirmation (gas or other)
    confirmed: false,
    // triggers when the entity sent to publish on main
    published: false,

    // id: null,
    // type: null,
    // payload: new Map(),
    // titleId: null,
    // messageId: null,
    // gas: null,
    // status: null
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
