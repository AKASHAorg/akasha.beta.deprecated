import React, { Component, PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { SvgIcon, IconButton } from 'material-ui';
import { StatusBarEthereum, StatusBarIpfs } from 'shared-components/svg'; // eslint-disable-line import/no-unresolved, import/extensions
import ServiceState from 'constants/ServiceState'; // eslint-disable-line import/no-unresolved, import/extensions
import { generalMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import { toggleGethDetailsModal,
    toggleIpfsDetailsModal } from 'local-flux/actions/app-actions'; // eslint-disable-line import/no-unresolved, import/extensions

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

    getContainerStyle (state) {
        const { muiTheme } = this.context;
        const style = Object.assign({}, containerStyle);
        switch (state) {
            case ServiceState.stopped:
                style.borderColor = muiTheme.palette.accent1Color;
                break;
            case ServiceState.starting:
            case ServiceState.downloading:
                style.borderColor = muiTheme.palette.accent2Color;
                break;
            case ServiceState.started:
                style.borderColor = muiTheme.palette.accent3Color;
                break;
            default:
                style.borderColor = muiTheme.palette.textColor;
                break;
        }

        return style;
    }

    getTitleButtonStyle (tab) {
        const { palette } = this.context.muiTheme;
        return {
            color: this.state.activeTab === tab ?
                palette.textColor :
                palette.disabledColor,
            backgroundColor: palette.canvasColor,
            width: '50%',
            height: '48px',
            padding: '0px',
            fontSize: '14px',
            fontWeight: '500',
            textTransform: 'uppercase'
        };
    }

    getIpfsState () {
        const { ipfsStarting, ipfsStatus } = this.props;
        let ipfsState = ServiceState.stopped;

        if (ipfsStatus.get('spawned') || ipfsStatus.get('started')) {
            ipfsState = ServiceState.started;
        } else if (ipfsStatus.get('downloading')) {
            ipfsState = ServiceState.downloading;
        } else if (ipfsStarting) {
            ipfsState = ServiceState.starting;
        }
        return ipfsState;
    }

    getGethState () {
        const { gethStarting, gethStatus } = this.props;
        let gethState = ServiceState.stopped;

        if (gethStatus.get('api') && !gethStatus.get('stopped')) {
            gethState = ServiceState.started;
        } else if (gethStatus.get('downloading')) {
            gethState = ServiceState.downloading;
        } else if (gethStarting || gethStatus.get('spawned') || gethStatus.get('starting')) {
            gethState = ServiceState.starting;
        }
        return gethState;
    }

    getTooltip (state) {
        const { intl } = this.props;
        switch (state) {
            case ServiceState.starting:
                return intl.formatMessage(generalMessages.starting);
            case ServiceState.downloading:
                return intl.formatMessage(generalMessages.downloading);
            case ServiceState.started:
                return intl.formatMessage(generalMessages.running);
            case ServiceState.stopped:
                return intl.formatMessage(generalMessages.stopped);
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
        return (<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {this.props.gethStatus &&
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
          }
          {this.props.ipfsStatus &&
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
          }
        </div>);
    }
}

ServiceStatusBar.propTypes = {
    gethStarting: PropTypes.bool,
    gethStatus: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    ipfsStarting: PropTypes.bool,
    ipfsStatus: PropTypes.shape().isRequired,
    toggleGethDetails: PropTypes.func,
    toggleIpfsDetails: PropTypes.func,
};

ServiceStatusBar.contextTypes = {
    muiTheme: PropTypes.shape().isRequired
};

function mapStateToProps (state) {
    return {
        gethStarting: state.externalProcState.getIn(['geth', 'flags', 'gethStarting']),
        gethStatus: state.externalProcState.getIn(['geth', 'status']),
        ipfsStarting: state.externalProcState.getIn(['ipfs', 'flags', 'ipfsStarting']),
        ipfsStatus: state.externalProcState.getIn(['ipfs', 'status']),
    };
}

export default connect(
    mapStateToProps,
    {
        toggleGethDetails: toggleGethDetailsModal,
        toggleIpfsDetails: toggleIpfsDetailsModal
    }
)(injectIntl(ServiceStatusBar));
