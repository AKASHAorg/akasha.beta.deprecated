import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import { SvgIcon, IconButton } from 'material-ui';
import { StatusBarEthereum, StatusBarIpfs } from '../shared-components/svg';
import serviceState from '../constants/serviceState';
import { generalMessages } from '../locale-data/messages';
import { toggleGethDetailsModal,
    toggleIpfsDetailsModal } from '../local-flux/actions/app-actions';

const containerStyle = {
    border: '2px solid',
    borderRadius: '16px',
    lineHeight: '32px',
    height: '32px',
    width: '32px',
    display: 'inline-flex',
    textAlign: 'center',
    margin: '0 5px',
    justifyContent: 'center',
    alignItems: 'center'
};
const buttonStyle = {
    width: '32px',
    minWidth: '32px',
    height: '32px',
    borderRadius: '16px',
    padding: '0px'
};

class ServiceStatusBar extends Component {
    componentDidMount () {
        ReactTooltip.rebuild();
    }

    getContainerStyle (state) {
        const { palette } = this.context.muiTheme;
        const style = Object.assign({}, containerStyle);
        switch (state) {
            case serviceState.stopped:
                style.borderColor = palette.accent1Color;
                break;
            case serviceState.downloading:
            case serviceState.starting:
            case serviceState.upgrading:
                style.borderColor = palette.accent2Color;
                break;
            case serviceState.started:
                style.borderColor = palette.accent3Color;
                break;
            default:
                style.borderColor = palette.textColor;
                break;
        }

        return style;
    }

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
        const { toggleGethDetails, toggleIpfsDetails } = this.props;
        const { palette } = this.context.muiTheme;
        const iconStyle = {
            width: '24px',
            height: '24px',
            color: palette.textColor,
            position: 'relative',
            top: '4px'
        };
        const gethState = this.getGethState();
        const ipfsState = this.getIpfsState();

        return (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={this.getContainerStyle(gethState)}>
              <div
                data-tip={this.getTooltip(gethState)}
                style={{ display: 'inline-block', height: '32px' }}
              >
                <IconButton
                  style={buttonStyle}
                  onClick={toggleGethDetails}
                  iconStyle={iconStyle}
                >
                  <SvgIcon viewBox="0 0 16 16">
                    <StatusBarEthereum />
                  </SvgIcon>
                </IconButton>
              </div>
            </div>
            <div style={this.getContainerStyle(ipfsState)}>
              <div
                data-tip={this.getTooltip(ipfsState)}
                style={{ display: 'inline-block', height: '32px' }}
              >
                <IconButton
                  style={buttonStyle}
                  onClick={toggleIpfsDetails}
                  iconStyle={iconStyle}
                >
                  <SvgIcon viewBox="0 0 16 16">
                    <StatusBarIpfs />
                  </SvgIcon>
                </IconButton>
              </div>
            </div>
          </div>
        );
    }
}

ServiceStatusBar.contextTypes = {
    muiTheme: PropTypes.shape()
};

ServiceStatusBar.propTypes = {
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
        toggleGethDetails: toggleGethDetailsModal,
        toggleIpfsDetails: toggleIpfsDetailsModal
    },
    null,
    { pure: false }
)(injectIntl(ServiceStatusBar));

