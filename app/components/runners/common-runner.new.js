import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import {
    authDialogToggle,
    pendingActionSave,
    publishConfirmDialogToggle,
    transferConfirmDialogToggle,
    weightConfirmDialogToggle,
    otherConfirmDialogToggle,
    pendingActionUpdate } from '../../local-flux/actions/app-actions';

const GAS_CONFIRMATION_ENTITIES = ['tempProfile'];
const WEIGHT_CONFIRMATION_ENTITIES = ['upvote', 'downvote'];
const TRANSFER_CONFIRMATION_ENTITIES = ['tip'];

class CommonRunner extends Component {
    shouldComponentUpdate (nextProps) {
        return !nextProps.loggedProfile.equals(this.props.loggedProfile) ||
            !nextProps.pendingActions.equals(this.props.pendingActions);
    }

    componentWillUpdate (nextProps) {
        const { pendingActions, loggedProfile, state } = nextProps;
        const { dispatch } = this.props;

        // immutable map .forEach()
        pendingActions.forEach((action) => {
            const { currentAction, confirmed, entityType, entityId } = action;
            const isLoggedIn = Date.parse(loggedProfile.get('expiration')) - 3000 > Date.now();

            if (!confirmed) {
                this._toggleDialog(entityType, entityId);
                return false; // break the loop
            }

            if (!isLoggedIn) {
                dispatch(authDialogToggle(entityId));
                return false; // break the loop
            }

            const actionPayload = this._getActionPayload(action, state);
            this._savePendingAction(loggedProfile.get('akashaId'), action, actionPayload);

            return dispatch({ type: `${entityType}/${currentAction}`, data: actionPayload });
        });
    }

    _getActionPayload = (action, state) => {
        const { entityType } = action;
        let entityPayload;
        switch (entityType) {
            case 'tempProfile':
                entityPayload = state.tempProfileState.get('tempProfile');
                break;
            default:
                entityPayload = null;
        }
        return entityPayload;
    };

    _savePendingAction = (akashaId, action, entityPayload) => {
        const { dispatch } = this.props;
        dispatch(pendingActionSave(akashaId, action, entityPayload));
    };

    _toggleDialog = (entityType, entityId) => {
        const { dispatch } = this.props;

        switch (true) {
            case GAS_CONFIRMATION_ENTITIES.includes(entityType):
                return dispatch(publishConfirmDialogToggle(entityId));

            case WEIGHT_CONFIRMATION_ENTITIES.includes(entityId):
                return dispatch(weightConfirmDialogToggle(entityId));

            case TRANSFER_CONFIRMATION_ENTITIES.includes(entityId):
                return dispatch(transferConfirmDialogToggle(entityId));

            default:
                return dispatch(otherConfirmDialog(entityId));
        }
    };

    render () {
        return null;
    }
}

CommonRunner.propTypes = {
    loggedProfile: PropTypes.shape(),
    pendingActions: PropTypes.shape(),
    dispatch: PropTypes.func.isRequired,
};

export default connect(
    state => ({
        loggedProfile: state.profileState.get('loggedProfile'),
        pendingActions: state.appState.get('pendingActions'),
        publishConfirmDialog: state.appState.get('publishConfirmDialog'),
        authDialog: state.appState.get('showAuthDialog'),
        state
    })
)(CommonRunner);
