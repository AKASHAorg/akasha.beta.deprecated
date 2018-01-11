import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Select, Tooltip } from 'antd';
import serviceState from '../constants/serviceState';
import { generalMessages, settingsMessages } from '../locale-data/messages';
import { appSettingsToggle, toggleGethDetailsModal,
    toggleIpfsDetailsModal } from '../local-flux/actions/app-actions';
import { saveGeneralSettings } from '../local-flux/actions/settings-actions';
import { selectGeneralSettings } from '../local-flux/selectors';
import { Icon } from './';

const { Option } = Select;

class ServiceStatusBar extends Component {
    getCircleColor = (state) => {
        switch (state) {
            case serviceState.stopped:
                return 'Red';
            case serviceState.downloading:
            case serviceState.starting:
            case serviceState.upgrading:
                return 'Orange';
            case serviceState.started:
                return 'Green';
            default:
                return '';
        }
    };

    getIpfsState () {
        const { ipfsStarting, ipfsStatus } = this.props;
        let ipfsState = serviceState.stopped;

        if (ipfsStatus.get('downloading')) {
            ipfsState = serviceState.downloading;
        } else if (ipfsStatus.get('upgrading')) {
            ipfsState = serviceState.upgrading;
        } else if (ipfsStatus.get('started') || ipfsStatus.get('process')) {
            ipfsState = serviceState.started;
        } else if (ipfsStarting || ipfsStatus.get('starting')) {
            ipfsState = serviceState.starting;
        }
        return ipfsState;
    }

    getGethState () {
        const { gethStarting, gethStatus } = this.props;
        let gethState = serviceState.stopped;

        if (gethStatus.get('downloading')) {
            gethState = serviceState.downloading;
        } else if (gethStatus.get('upgrading')) {
            gethState = serviceState.upgrading;
        } else if (gethStatus.get('started') || gethStatus.get('process')) {
            gethState = serviceState.started;
        } else if (gethStarting || gethStatus.get('starting')) {
            gethState = serviceState.starting;
        }
        return gethState;
    }

    getTooltip (state) {
        const { intl } = this.props;
        switch (state) {
            case serviceState.starting:
                return intl.formatMessage(generalMessages.starting);
            case serviceState.downloading:
                return intl.formatMessage(generalMessages.downloading);
            case serviceState.started:
                return intl.formatMessage(generalMessages.running);
            case serviceState.stopped:
                return intl.formatMessage(generalMessages.stopped);
            case serviceState.upgrading:
                return intl.formatMessage(generalMessages.upgrading);
            default:
                return intl.formatMessage(generalMessages.stopped);
        }
    }

    handleChange = (value) => {
        if (value !== 'translate') {
            this.props.saveGeneralSettings({
                locale: value
            });
        }
    };

    render () {
        const { generalSettings, intl, toggleGethDetails, toggleIpfsDetails, withCircles } = this.props;
        const gethState = this.getGethState();
        const ipfsState = this.getIpfsState();
        const gethColor = this.getCircleColor(gethState);
        const ipfsColor = this.getCircleColor(ipfsState);
        const gethIcon = withCircles ? `geth${gethColor}` : 'geth';
        const ipfsIcon = withCircles ? `ipfs${ipfsColor}` : 'ipfs';

        return (
          <div className="service-status-bar">
            <Tooltip title={this.getTooltip(gethState)}>
              <div
                className="content-link flex-center service-status-bar__button"
                onClick={toggleGethDetails}
              >
                <Icon className="service-status-bar__geth-icon" type={gethIcon} />
                {!withCircles && gethColor === 'Red' &&
                  <div className="service-status-bar__dot" />
                }
              </div>
            </Tooltip>
            <Tooltip title={this.getTooltip(ipfsState)}>
              <div
                className="content-link flex-center service-status-bar__button"
                onClick={toggleIpfsDetails}
              >
                <Icon className="service-status-bar__ipfs-icon" type={ipfsIcon} />
                {!withCircles && ipfsColor === 'Red' &&
                  <div className="service-status-bar__dot" />
                }
              </div>
            </Tooltip>
            {withCircles &&
              <Select
                className="service-status-bar__select"
                dropdownClassName="service-status-bar__select-dropdown"
                onChange={this.handleChange}
                size="small"
                value={generalSettings.get('locale')}
              >
                <Option value="en">{intl.formatMessage(settingsMessages.english)}</Option>
                <Option value="es">{intl.formatMessage(settingsMessages.spanish)}</Option>
                <Option className="flex-center-y service-status-bar__translate-option" value="translate">
                  <a className="unstyled-link" href="https://crowdin.com/project/akasha" >
                    {intl.formatMessage(generalMessages.translate)}
                  </a>
                  <Icon className="service-status-bar__link-icon" type="link" />
                </Option>
              </Select>
            }
          </div>
        );
    }
}

ServiceStatusBar.propTypes = {
    generalSettings: PropTypes.shape().isRequired,
    gethStarting: PropTypes.bool,
    gethStatus: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    ipfsStarting: PropTypes.bool,
    ipfsStatus: PropTypes.shape().isRequired,
    saveGeneralSettings: PropTypes.func.isRequired,
    toggleGethDetails: PropTypes.func.isRequired,
    toggleIpfsDetails: PropTypes.func.isRequired,
    withCircles: PropTypes.bool
};

function mapStateToProps (state) {
    return {
        generalSettings: selectGeneralSettings(state),
        gethStarting: state.externalProcState.getIn(['geth', 'flags', 'gethStarting']),
        gethStatus: state.externalProcState.getIn(['geth', 'status']),
        ipfsStarting: state.externalProcState.getIn(['ipfs', 'flags', 'ipfsStarting']),
        ipfsStatus: state.externalProcState.getIn(['ipfs', 'status']),
    };
}

export { ServiceStatusBar };
export default connect(
    mapStateToProps,
    {
        appSettingsToggle,
        saveGeneralSettings,
        toggleGethDetails: toggleGethDetailsModal,
        toggleIpfsDetails: toggleIpfsDetailsModal
    },
    null,
    { pure: false }
)(injectIntl(ServiceStatusBar));

