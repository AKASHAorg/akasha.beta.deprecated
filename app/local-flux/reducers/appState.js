import { fromJS, List, Map } from 'immutable';
import { AppRecord, NotificationRecord, PendingActionRecord } from './records';
import * as types from '../constants';
import * as appTypes from '../constants/AppConstants';
import actionTypes from '../../constants/action-types';
import { createReducer } from './create-reducer';

const initialState = new AppRecord();
let id = 0;

const appState = createReducer(initialState, {

    [appTypes.SHOW_NOTIFICATION]: (state, { notification }) => state.merge({
        notifications: state.get('notifications').push(new NotificationRecord(notification))
    }),

    [appTypes.HIDE_NOTIFICATION]: (state, { notification }) => {
        const indexToRemove = state.get('notifications').findIndex(notific =>
            notific.id === notification.id);

        return state.merge({
            notifications: state.get('notifications').delete(indexToRemove)
        });
    },

    [appTypes.ADD_PENDING_ACTION]: (state, { data }) =>
        state.merge({
            pendingActions: state.get('pendingActions').push(new PendingActionRecord(fromJS(data)))
        }),

    [appTypes.SHOW_TERMS]: state =>
        state.merge({
            showTerms: true
        }),

    [appTypes.HIDE_TERMS]: state =>
        state.merge({
            showTerms: false
        }),

    [appTypes.TOGGLE_GETH_DETAILS_MODAL]: state =>
        state.set('showGethDetailsModal', !state.get('showGethDetailsModal')),

    [appTypes.TOGGLE_IPFS_DETAILS_MODAL]: state =>
        state.set('showIpfsDetailsModal', !state.get('showIpfsDetailsModal')),

// ********************* NEW REDUCERS ******************************

    [types.APP_READY]: state =>
        state.set('appReady', true),

    [types.BOOTSTRAP_HOME_SUCCESS]: state =>
        state.set('homeReady', true),

    [types.COMMENTS_ADD_PUBLISH_ACTION]: (state, { payload }) => {
        id += 1;
        return state.setIn(['pendingActions', id], new PendingActionRecord({
            id,
            gas: 2000000,
            messageId: 'publishComment',
            payload: fromJS(payload),
            status: 'checkAuth',
            titleId: 'publishCommentTitle',
            type: actionTypes.comment
        }));
    },

    [types.DELETE_PENDING_ACTION]: (state, { actionId }) =>
        state.set('pendingActions', state.get('pendingActions').delete(actionId)),

    [types.ENTRY_ADD_CLAIM_ACTION]: (state, { payload }) => {
        id += 1;
        return state.setIn(['pendingActions', id], new PendingActionRecord({
            id,
            type: actionTypes.claim,
            payload: fromJS(payload),
            gas: 2000000,
            titleId: 'claimTitle',
            messageId: 'claim',
            status: 'checkAuth'
        }));
    },

    [types.ENTRY_ADD_DOWNVOTE_ACTION]: (state, { payload }) => {
        id += 1;
        return state.setIn(['pendingActions', id], new PendingActionRecord({
            id,
            type: actionTypes.downvote,
            payload: fromJS(payload),
            gas: 2000000,
            status: 'needWeightConfirmation'
        }));
    },

    [types.ENTRY_ADD_UPVOTE_ACTION]: (state, { payload }) => {
        id += 1;
        return state.setIn(['pendingActions', id], new PendingActionRecord({
            id,
            type: actionTypes.upvote,
            payload: fromJS(payload),
            gas: 2000000,
            status: 'needWeightConfirmation'
        }));
    },

    [types.HIDE_AUTH_DIALOG]: state =>
        state.set('showAuthDialog', null),

    [types.HIDE_LOGIN_DIALOG]: state =>
        state.set('showLoginDialog', null),

    [types.HIDE_PUBLISH_CONFIRM_DIALOG]: state =>
        state.set('publishConfirmDialog', null),

    [types.HIDE_REPORT_MODAL]: state =>
        state.set('showReportModal', false),

    [types.HIDE_TRANSFER_CONFIRM_DIALOG]: state =>
        state.set('transferConfirmDialog', null),

    [types.HIDE_WEIGHT_CONFIRM_DIALOG]: state =>
        state.set('weightConfirmDialog', null),

    [types.PROFILE_ADD_FOLLOW_ACTION]: (state, { payload }) => {
        id += 1;
        return state.setIn(['pendingActions', id], new PendingActionRecord({
            id,
            gas: 2000000,
            messageId: 'followProfile',
            payload: fromJS(payload),
            status: 'checkAuth',
            titleId: 'followProfileTitle',
            type: actionTypes.follow,
        }));
    },

    [types.PROFILE_ADD_TIP_ACTION]: (state, { payload }) => {
        id += 1;
        return state.setIn(['pendingActions', id], new PendingActionRecord({
            id,
            gas: 2000000,
            messageId: 'sendTip',
            payload: fromJS(payload),
            status: 'needTransferConfirmation',
            titleId: 'sendTipTitle',
            type: actionTypes.sendTip,
        }));
    },
   
    [types.PROFILE_ADD_UNFOLLOW_ACTION]: (state, { payload }) => {
        id += 1;
        return state.setIn(['pendingActions', id], new PendingActionRecord({
            id,
            gas: 2000000,
            messageId: 'unfollowProfile',
            payload: fromJS(payload),
            status: 'checkAuth',
            titleId: 'unfollowProfileTitle',
            type: actionTypes.unfollow,
        }));
    },

    [types.PROFILE_LOGIN_SUCCESS]: (state) => {
        const action = state.get('pendingActions').find(act =>
            act.get('status') === 'checkAuth');
        if (action) {
            return state.merge({
                pendingActions: state
                    .get('pendingActions')
                    .setIn([action.get('id'), 'status'], 'readyToPublish'),
                showAuthDialog: null
            });
        }
        return state.set('showAuthDialog', null);
    },

    [types.PROFILE_LOGOUT]: state =>
        state.merge({
            notifications: new List(),
            pendingActions: new Map()
        }),

    [types.RESET_HOME_READY]: state =>
        state.set('homeReady', false),

    [types.SHOW_AUTH_DIALOG]: (state, { actionId }) =>
        state.set('showAuthDialog', actionId),

    [types.SHOW_LOGIN_DIALOG]: (state, { akashaId }) =>
        state.set('showLoginDialog', akashaId),

    [types.SHOW_PUBLISH_CONFIRM_DIALOG]: (state, { actionId }) =>
        state.set('publishConfirmDialog', actionId),

    [types.SHOW_REPORT_MODAL]: state =>
        state.set('showReportModal', true),

    [types.SHOW_TRANSFER_CONFIRM_DIALOG]: (state, { actionId }) =>
        state.set('transferConfirmDialog', actionId),

    [types.SHOW_WEIGHT_CONFIRM_DIALOG]: (state, { actionId }) =>
        state.set('weightConfirmDialog', actionId),

    [types.UPDATE_ACTION]: (state, { actionId, updates }) => {
        const newAction = state.getIn(['pendingActions', actionId]).mergeDeep(updates);
        return state.setIn(['pendingActions', actionId], newAction);
    },
});

export default appState;
