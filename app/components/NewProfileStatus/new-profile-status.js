import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { injectIntl } from 'react-intl';
import PanelContainerFooter from '../PanelContainer/panel-container-footer';
import { generalMessages, setupMessages } from '../../locale-data/messages';
import * as types from '../../local-flux/constants';

const ABORT_DISABLED_TYPES = [
    types.TEMP_PROFILE_FAUCET_TX_MINED_SUCCESS,
    types.TEMP_PROFILE_LOGIN,
    types.TEMP_PROFILE_LOGIN_SUCCESS,
    types.TEMP_PROFILE_PUBLISH_TX_MINED,
    types.TEMP_PROFILE_PUBLISH_TX_MINED_SUCCESS,
    types.TEMP_PROFILE_PUBLISH,
    types.TEMP_PROFILE_PUBLISH_SUCCESS
];

class NewProfileStatus extends Component {
    _getStatusText = () => {
        const { tempProfileStatus, akashaId } = this.props;
        console.log(tempProfileStatus.get('currentStep'), akashaId, 'tempProfileStatus');
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
        console.log('abort profile');
    }
    _handleStepRetry = () => {
        console.log('retry rofile creation');
    }
    render () {
        const { intl } = this.props;
        console.log(this.props, 'the props');
        return (
          <div>
            {this._getStatusText()}
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
    tempProfileStatus: PropTypes.shape().isRequired,
    akashaId: PropTypes.string.isRequired,
    errors: PropTypes.shape(),
    intl: PropTypes.shape()
};

export default injectIntl(NewProfileStatus);
