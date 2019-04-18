// @flow strict
import { List } from 'immutable';
import ActionStateModel from './state-models/action-state-model';
import * as actionStatus from '../../constants/action-status';
import * as actionTypes from '../../constants/action-types';
import * as types from '../constants';
import { createReducer, genTimeBasedID } from './utils';

/* ::
    import type { ActionAddPayload, ActionNoFunds } from '../../flow-types/actions/action-actions';
    import type { ActionParams } from '../../flow-types/actions/action';
 */

const initialState = new ActionStateModel();

const actionState = createReducer(initialState, {
    [types.ACTION_ADD]: (state, action /* : ActionParams */) => {
        const payload /*: ActionAddPayload */ = action.payload;
        const { actionType, ethAddress } = payload;
        if (actionType === actionTypes.faucet) {
            const id = genTimeBasedID(null, actionType);
            const status = actionStatus.toPublish;
            const action = state.createAction({
                id,
                ethAddress,
                payload,
                status,
                type: actionType
            });
            return state.merge({
                byId: state.get('byId').set(id, action),
                [status]: id
            });
        }
        return state;
    },
    [types.ACTION_ADD_NO_FUNDS]: (state, action /* : ActionParams */) => {
        const payload /* : ActionNoFunds */ = action.payload;
        const { ethAddress, actionType, needEth, needAeth, needMana } = payload;
        const id = genTimeBasedID(null, actionType);
        const status = actionType === actionTypes.faucet ? actionStatus.toPublish : actionStatus.needAuth;
        const publishAction = state.createAction({
            id,
            ethAddress,
            payload,
            status,
            type: actionType
        });
        return state.merge({
            byId: state.get('byId').set(id, publishAction),
            [status]: id,
            needEth,
            needAeth,
            needMana
        });
    },
    [types.ACTION_ADD_SUCCESS]: (state, { ethAddress, payload, actionType }) => {
        if (actionType === actionTypes.faucet) {
            return state;
        }
        const id = genTimeBasedID(null, actionType);
        const status = actionType === actionTypes.faucet ? actionStatus.toPublish : actionStatus.needAuth;
        const action = state.createAction({ id, ethAddress, payload, status, type: actionType });
        return state.merge({
            byId: state.get('byId').set(id, action),
            [status]: id,
            needEth: false,
            needAeth: false,
            needMana: false
        });
    },

    [types.ACTION_CLEAR_HISTORY]: state =>
        state.merge({
            history: new List(),
            historyTypes: new List()
        }),

    [types.ACTION_DELETE]: (state, { id }) => {
        const needAuth = state.get('needAuth');
        const action = state.getIn(['byId', id]);
        if (!action) {
            return state;
        }
        const pending = state.state.removePendingAction(state.get('pending'), action.toJS());
        return state.merge({
            byId: state.get('byId').delete(id),
            needAuth: needAuth === id ? null : needAuth,
            pending
        });
    },

    [types.ACTION_GET_ALL_HISTORY]: (state, { loadMore }) => {
        if (loadMore) {
            return state.setIn(['flags', 'fetchingMoreHistory'], true);
        }
        return state.setIn(['flags', 'fetchingHistory'], true);
    },

    [types.ACTION_GET_ALL_HISTORY_ERROR]: (state, { request }) => {
        if (request.loadMore) {
            return state.setIn(['flags', 'fetchingMoreHistory'], false);
        }
        return state.setIn(['flags', 'fetchingHistory'], false);
    },

    [types.ACTION_GET_ALL_HISTORY_SUCCESS]: (state, { data, request }) => {
        let byId = state.get('byId');
        let history = request.loadMore ? state.get('history') : new List();
        data.forEach(action => {
            byId = byId.set(action.id, state.createAction(action));
            history = history.push(action.id);
        });
        const flags = request.loadMore
            ? state.get('flags').set('fetchingMoreHistory', false)
            : state.get('flags').set('fetchingHistory', false);
        return state.merge({
            byId,
            flags,
            history
        });
    },

    [types.ACTION_GET_HISTORY]: state => state.setIn(['flags', 'fetchingHistory'], true),

    [types.ACTION_GET_HISTORY_ERROR]: state => state.setIn(['flags', 'fetchingHistory'], false),

    [types.ACTION_GET_HISTORY_SUCCESS]: (state, { data, request }) => {
        let byId = state.get('byId');
        const fetchingAethTransfers = state.getIn(['flags', 'fetchingAethTransfers']);
        let list = fetchingAethTransfers ? new List() : state.get('history');
        data.forEach(action => {
            byId = byId.set(action.id, state.createAction(action));
            list = list.push(action.id);
        });
        return state.merge({
            byId,
            flags: state.get('flags').set('fetchingHistory', false),
            history: state.sortByBlockNr(byId, list),
            historyTypes: List(request)
        });
    },

    [types.ACTION_GET_PENDING_SUCCESS]: (state, { data }) => {
        let byId = state.get('byId');
        let pending = state.get('pending');
        let publishing = new List();
        data.forEach(action => {
            byId = byId.set(action.id, state.createAction(action));
            pending = state.addPendingAction(pending, action);
            publishing = publishing.push(action.id);
        });
        return state.merge({
            byId,
            pending,
            publishing
        });
    },

    [types.ACTION_RESET_FUNDING_REQUIREMENTS]: state =>
        state.merge({
            needEth: false,
            needAeth: false,
            needMana: false
        }),

    [types.ACTION_PUBLISH]: (state, { id }) => {
        const action = state.getIn(['byId', id]);
        let pending = state.get('pending');
        if (action.type === actionTypes.batch) {
            /*
             * for batch actions, this is where we should add the actions in state
             */
            let byId = state.get('byId');
            let batchActions = new List();
            action.getIn(['payload', 'actions']).forEach((actionData, index) => {
                const { ethAddress, actionType, payload } = actionData.toJS();
                const actionId = `${ new Date().getTime() }-${ actionType }-${ index }`;
                const status = actionStatus.publishing;
                const newAction = state.createAction({
                    id: actionId,
                    ethAddress,
                    payload,
                    status,
                    type: actionType
                });
                byId = byId.set(actionId, newAction);
                pending = state.addPendingAction(pending, newAction.toJS());
                batchActions = batchActions.push(actionId);
            });
            return state.merge({ batchActions, byId, needAuth: null, pending });
        }
        return state.merge({
            needAuth: null,
            pending: state.addPendingAction(pending, action.toJS())
        });
    },
    [types.ACTION_UPDATE]: (state, { changes }) => {
        if (!changes || !changes.id) {
            return state;
        }
        const newActionId = state.getIn(['byId', changes.id]);
        if (!newActionId) {
            return state;
        }
        const newAction = state.getIn(['byId', changes.id]).mergeDeep(changes);
        let publishing = state.get('publishing');
        let pending = state.get('pending');
        const historyTypes = state.get('historyTypes');
        let history = state.get('history');
        if (changes.status === actionStatus.publishing) {
            publishing = publishing.push(changes.id);
            if (historyTypes.includes(newAction.type)) {
                history = history.unshift(newAction.id);
            }
        } else if (changes.status === actionStatus.published) {
            pending = state.removePendingAction(pending, newAction.toJS());
            publishing = publishing.filter(id => id !== changes.id);
        }
        return state.merge({
            byId: state.get('byId').set(changes.id, newAction),
            history,
            needAuth: changes.status === actionStatus.needAuth ? changes.id : state.get('needAuth'),
            pending,
            publishing
        });
    },

    // [types.PROFILE_AETH_TRANSFERS_ITERATOR]: state =>
    //     state.setIn(['flags', 'fetchingAethTransfers'], true),

    // [types.PROFILE_AETH_TRANSFERS_ITERATOR_ERROR]: state =>
    //     state.setIn(['flags', 'fetchingAethTransfers'], false),

    // [types.PROFILE_AETH_TRANSFERS_ITERATOR_SUCCESS]: (state, { data }) => {
    //     const type = actionTypes.receiveAeth;
    //     const fetchingHistory = state.getIn(['flags', 'fetchingHistory']);
    //     let byId = state.get('byId');
    //     let list = fetchingHistory ? new List() : state.get('history');
    //     data.collection.forEach((event, index) => {
    //         const id = `${event.blockNumber}-${event.from.ethAddress}-${type}-${index}`;
    //         const payload = fromJS({ amount: event.amount });
    //         const action = new ActionRecord({ blockNumber: event.blockNumber, id, success: true, type })
    //             .set('payload', payload);
    //         if (!byId.get(action.id)) {
    //             byId = byId.set(action.id, action);
    //             list = list.push(action.id);
    //         }
    //     });
    //     return state.merge({
    //         byId,
    //         flags: state.get('flags').set('fetchingAethTransfers', false),
    //         history: sortByBlockNr(byId, list),
    //     });
    // },

    [types.PROFILE_LOGOUT_SUCCESS]: () => initialState
});

export default actionState;
