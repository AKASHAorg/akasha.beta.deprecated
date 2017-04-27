import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from '../../shared-components/Loaders/circular-progress';
import { injectIntl } from 'react-intl';
import PanelContainerFooter from '../PanelContainer/panel-container-footer';
import { generalMessages, setupMessages, profileMessages } from '../../locale-data/messages';
import * as types from '../../local-flux/constants';
import styles from './new-profile-status.scss';

/**
 * temp profile actions in order of occurence
 *
 * TEMP_PROFILE_CREATE_SUCCESS,
 * ETH_ADDRESS_CREATE,
 * ETH_ADDRESS_CREATE_SUCCESS,
 * FUND_FROM_FAUCET,
 * FUND_FROM_FAUCET_SUCCESS,
 * TEMP_PROFILE_FAUCET_TX_MINED,
 * TEMP_PROFILE_FAUCET_TX_MINED_SUCCESS,
 * TEMP_PROFILE_LOGIN,
 * TEMP_PROFILE_LOGIN_SUCCESS,
 * TEMP_PROFILE_PUBLISH,
 * TEMP_PROFILE_PUBLISH_SUCCESS,
 * TEMP_PROFILE_PUBLISH_TX_MINED,
 * TEMP_PROFILE_PUBLISH_TX_MINED_SUCCESS,
 * null => deleted
 *
 */
const STATUS_TYPES = [
    types.TEMP_PROFILE_CREATE,
    types.TEMP_PROFILE_CREATE_SUCCESS,
    types.ETH_ADDRESS_CREATE_SUCCESS,
    types.ETH_ADDRESS_CREATE,
    types.FUND_FROM_FAUCET,
    types.FUND_FROM_FAUCET_SUCCESS,
    types.TEMP_PROFILE_FAUCET_TX_MINED,
    types.TEMP_PROFILE_FAUCET_TX_MINED_SUCCESS,
    types.TEMP_PROFILE_LOGIN,
    types.TEMP_PROFILE_LOGIN_SUCCESS,
    types.TEMP_PROFILE_PUBLISH,
    types.TEMP_PROFILE_PUBLISH_SUCCESS,
    types.TEMP_PROFILE_PUBLISH_TX_MINED,
    types.TEMP_PROFILE_PUBLISH_TX_MINED_SUCCESS
];
const ABORT_DISABLED_TYPES = STATUS_TYPES.slice(4);

class NewProfileStatus extends Component {
    state = {
        finished: false
    }
    componentDidMount () {
        const { akashaId, tempProfileGetRequest } = this.props;
        if (!akashaId) {
            tempProfileGetRequest();
        }
    }
    componentWillReceiveProps (nextProps) {
        const { akashaId, tempProfile, tempProfileStatus, tempProfileCreate } = nextProps;
        const { history } = this.props;
        if (!this.props.akashaId && akashaId) {
            tempProfileCreate(tempProfile.toJS());
        }
        if (tempProfileStatus.get('currentAction') === STATUS_TYPES[STATUS_TYPES.length - 1]) {
            this.setState({
                finished: true
            }, () => {
                history.push('/setup/new-profile-complete');
            });
        }
    }
    _getStatusText = () => {
        const { tempProfileStatus, akashaId, intl } = this.props;
        const { formatMessage } = intl;
        const currentAction = tempProfileStatus.get('currentAction');
        if (currentAction) {
            return formatMessage(profileMessages[currentAction], {
                akashaId,
                faucetTx: tempProfileStatus.get('faucetTx'),
                publishTx: tempProfileStatus.get('publishTx')
            });
        }
        if (this.state.finished) {
            return formatMessage(profileMessages.finishingProfileCreation);
        }
        return formatMessage(profileMessages.findingProfiles);
    }
    _isAbortButtonDisabled = () => {
        const { tempProfileStatus } = this.props;
        const { currentStatus } = tempProfileStatus;
        if (ABORT_DISABLED_TYPES.includes(currentStatus)) {
            return true;
        }
        return false;
    }
    _isRetryButtonDisabled = () => {
        const { errors } = this.props;
        // @TODO: also check if geth and ipfs are running
        return errors && (errors.size === 0 || errors.length === 0);
    }
    _handleProfileAbortion = () => {
        const { history, tempProfileDelete, akashaId } = this.props;
        tempProfileDelete({ akashaId });
        history.push('/setup/authenticate');
    }
    _handleStepRetry = () => {
        const { tempProfile, tempProfileCreate, tempProfileStatusReset } = this.props;
        tempProfileStatusReset();
        tempProfileCreate(tempProfile.toJS());
    }
    _calculateProgressValue = () => {
        const { tempProfileStatus } = this.props;
        const currentAction = tempProfileStatus.get('currentAction');
        const index = STATUS_TYPES.findIndex(status => status === currentAction);
        return index * 7.142; // 14 steps, 100 / 14 = 7.142
    }
    render () {
        const { intl } = this.props;
        return (
          <div className={`col-xs-12 ${styles.root}`}>
            <div className={`row ${styles.rootInner}`}>
              <h2 className={`col-xs-12 ${styles.statusTitle}`}>
                {intl.formatMessage(profileMessages.registeringIdentity)}
              </h2>
              <div className="col-xs-12">
                {intl.formatMessage(profileMessages.yourIdentityIsBroadcasted)}
              </div>
              <div className="col-xs-12">
                {intl.formatMessage(profileMessages.willTakeFewMoments)}...
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <div className="row center-xs">
                  <div className={`col-xs-6 ${styles.progressWrapper}`}>
                    <CircularProgress
                      mode="determinate"
                      value={this._calculateProgressValue()}
                      size={3}
                      strokeWidth={1.3}
                      style={{ transform: 'rotate(-90deg)' }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xs-12 center-xs">
                {this._getStatusText()}
              </div>
            </div>
            <PanelContainerFooter>
              <RaisedButton
                label={intl.formatMessage(generalMessages.abort)}
                onClick={this._handleProfileAbortion}
                disabled={this._isAbortButtonDisabled()}
                style={{ marginRight: 8 }}
              />
              <RaisedButton
                label={intl.formatMessage(setupMessages.retryStep)}
                onClick={this._handleStepRetry}
                primary
                disabled={this._isRetryButtonDisabled()}
              />
            </PanelContainerFooter>
          </div>
        );
    }
}
NewProfileStatus.propTypes = {
    akashaId: PropTypes.string.isRequired,
    errors: PropTypes.shape(),
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    tempProfile: PropTypes.shape(),
    tempProfileCreate: PropTypes.func.isRequired,
    tempProfileDelete: PropTypes.func.isRequired,
    tempProfileStatus: PropTypes.shape().isRequired,
    tempProfileStatusReset: PropTypes.func,
    tempProfileGetRequest: PropTypes.func.isRequired,
};

export default injectIntl(NewProfileStatus);
