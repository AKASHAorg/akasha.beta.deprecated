import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Icon, Tooltip } from 'antd';
import { StatusBarEthereum, StatusBarIpfs } from './svg';
import serviceState from '../constants/serviceState';
import { generalMessages } from '../locale-data/messages';
import { appSettingsToggle, toggleGethDetailsModal,
    toggleIpfsDetailsModal } from '../local-flux/actions/app-actions';

class ServiceStatusBar extends Component {
    getContainerClass = (state) => {
        const base = 'service-status-bar__container_';
        switch (state) {
            case serviceState.stopped:
                return `${base}red`;
            case serviceState.downloading:
            case serviceState.starting:
            case serviceState.upgrading:
                return `${base}orange`;
            case serviceState.started:
                return `${base}green`;
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

    render () {
        const { intl, toggleGethDetails, toggleIpfsDetails } = this.props;
        const gethState = this.getGethState();
        const ipfsState = this.getIpfsState();

        return (
          <div className="service-status-bar">
            <div className={`service-status-bar__container ${this.getContainerClass(gethState)}`}>
              <Tooltip title={this.getTooltip(gethState)}>
                <div className="service-status-bar__button" onClick={toggleGethDetails}>
                  <svg className="service-status-bar__icon" viewBox="0 0 16 16">
                    <StatusBarEthereum />
                  </svg>
                </div>
              </Tooltip>
            </div>
            <div className={`service-status-bar__container ${this.getContainerClass(ipfsState)}`}>
              <Tooltip title={this.getTooltip(ipfsState)}>
                <div className="service-status-bar__button" onClick={toggleIpfsDetails}>
                  <svg className="service-status-bar__icon" viewBox="0 0 16 16">
                    <StatusBarIpfs />
                  </svg>
                </div>
              </Tooltip>
            </div>
            <div className="service-status-bar__button">
              <Tooltip title={intl.formatMessage(generalMessages.appSettingsTitle)}>
                <Icon
                  type="setting"
                  style={{ fontSize: 28 }}
                  onClick={this.props.appSettingsToggle}
                />
              </Tooltip>
            </div>
          </div>
        );
    }
}

ServiceStatusBar.propTypes = {
    appSettingsToggle: PropTypes.func,
    gethStarting: PropTypes.bool,
    gethStatus: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    ipfsStarting: PropTypes.bool,
    ipfsStatus: PropTypes.shape().isRequired,
    toggleGethDetails: PropTypes.func.isRequired,
    toggleIpfsDetails: PropTypes.func.isRequired,
};

function mapStateToProps (state) {
    return {
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
        toggleGethDetails: toggleGethDetailsModal,
        toggleIpfsDetails: toggleIpfsDetailsModal
    },
    null,
    { pure: false }
)(injectIntl(ServiceStatusBar));

