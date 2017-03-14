import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Dialog, FlatButton, Tab, Tabs, Toggle } from 'material-ui';
import { IpfsOptionsForm, LogsList } from 'shared-components';
import { generalMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import { ipfsSetPorts, ipfsStart, ipfsStartLogger, ipfsStop,
    ipfsStopLogger } from 'local-flux/actions/external-process-actions'; // eslint-disable-line import/no-unresolved, import/extensions
import { toggleIpfsDetailsModal } from 'local-flux/actions/app-actions'; // eslint-disable-line import/no-unresolved, import/extensions
import { ipfsSaveSettings } from 'local-flux/actions/settings-actions'; // eslint-disable-line import/no-unresolved, import/extensions

const toggleStyle = {
    display: 'block',
    flex: '0 0 auto',
    width: 'auto',
    marginLeft: '10px'
};

const IPFS_SETTINGS = 'IPFS_SETTINGS';
const IPFS_LOGS = 'IPFS_LOGS';

class IpfsDetailsModal extends Component {
    state = {
        activeTab: IPFS_SETTINGS,
        apiPort: this.props.ipfsSettings.getIn(['ports', 'apiPort']),
        gatewayPort: this.props.ipfsSettings.getIn(['ports', 'gatewayPort']),
        isIpfsFormDirty: false,
        storagePath: this.props.ipfsSettings.get('storagePath'),
        swarmPort: this.props.ipfsSettings.getIn(['ports', 'swarmPort']),
    };

    componentWillReceiveProps (nextProps) {
        if (!nextProps.ipfsSettings.get('ports').equals(this.props.ipfsSettings.get('ports'))) {
            this.setState({
                apiPort: nextProps.ipfsSettings.getIn(['ports', 'apiPort']),
                gatewayPort: nextProps.ipfsSettings.getIn(['ports', 'gatewayPort']),
                swarmPort: nextProps.ipfsSettings.getIn(['ports', 'swarmPort'])
            });
        }
    }

    onToggle = () => {
        /* eslint-disable */
        const { ipfsStart, ipfsStop } = this.props;
        /* eslint-disable */
        if (this.isIpfsOn()) {
            ipfsStop();
        } else {
            ipfsStart();
        }
    };

    onApiPortChange = (ev) => {
        this.setState({
            apiPort: ev.target.value,
            isIpfsFormDirty: true
        });
    };

    onGatewayPortChange = (ev) => {
        this.setState({
            gatewayPort: ev.target.value,
            isIpfsFormDirty: true
        });
    };

    onSwarmPortChange = (ev) => {
        this.setState({
            swarmPort: ev.target.value,
            isIpfsFormDirty: true
        });
    };

    onStorageChange = (path) => {
        const { ipfsSettings } = this.props;
        this.setState({
            storagePath: path,
            isIpfsFormDirty: true
        });
        if (path !== ipfsSettings.get('storagePath')) {
            this.setState({
                apiPort: null,
                gatewayPort: null,
                swarmPort: null
            });
        } else {
            this.setState({
                apiPort: ipfsSettings.getIn(['ports', 'apiPort']),
                gatewayPort: ipfsSettings.getIn(['ports', 'gatewayPort']),
                swarmPort: ipfsSettings.getIn(['ports', 'swarmPort'])
            });
        }
    };

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

    getActions () {
        const { intl, ipfsBusyState, toggleIpfsDetailsModal } = this.props;
        return (<div style={{ display: 'flex' }}>
          <div style={{ flex: '0 0 auto', height: '36px', display: 'flex', alignItems: 'center' }}>
            <Toggle
              label={this.isIpfsOn() ?
                  intl.formatMessage(generalMessages.ipfsServiceOn) :
                  intl.formatMessage(generalMessages.ipfsServiceOff)
              }
              labelPosition="right"
              labelStyle={{ textAlign: 'left', width: 'calc(100% - 44px)' }}
              toggled={this.isIpfsOn()}
              onToggle={this.onToggle}
              disabled={ipfsBusyState}
              style={toggleStyle}
            />
          </div>
          <div style={{ flex: '1 1 auto' }} >
            <FlatButton
              label={intl.formatMessage(generalMessages.cancel)}
              onClick={toggleIpfsDetailsModal}
            />
            <FlatButton
              label={intl.formatMessage(generalMessages.save)}
              disabled={!this.state.isIpfsFormDirty}
              onClick={this.saveOptions}
            />
          </div>
        </div>);
    }

    selectTab = (tab) => {
        this.setState({
            activeTab: tab
        });
    };

    saveOptions = () => {
        const { ipfsSaveSettings, ipfsSetPorts, ipfsSettings, ipfsStatus } = this.props;
        const { apiPort, gatewayPort, swarmPort, storagePath } = this.state;
        const ports = {
            api: Number(apiPort) || null,
            gateway: Number(gatewayPort) || null,
            swarm: Number(swarmPort) || null
        };
        if (storagePath !== ipfsSettings.get('storagePath')) {
            ipfsSaveSettings({ storagePath }, true);
        } else if (ipfsStatus.get('api')) {
            ipfsSetPorts(ports);
        }
        this.setState({
            isIpfsFormDirty: false
        });
    };

    isIpfsOn = () => {
        const { ipfsStarting, ipfsStatus } = this.props;
        return ipfsStatus.get('spawned') || ipfsStatus.get('starting') || ipfsStarting;
    }

    renderTitle () {
        const { palette } = this.context.muiTheme;

        return (<div style={{ width: '100%' }}>
          <Tabs
            tabItemContainerStyle={{ width: '100%' }}
            onChange={this.selectTab}
            value={this.state.activeTab}
            inkBarStyle={{ backgroundColor: palette.primary1Color, zIndex: 2 }}
          >
            <Tab
              label="Settings"
              style={this.getTitleButtonStyle(IPFS_SETTINGS)}
              value={IPFS_SETTINGS}
            />
            <Tab
              label="Logs"
              style={this.getTitleButtonStyle(IPFS_LOGS)}
              value={IPFS_LOGS}
            />
          </Tabs>
        </div>);
    }

    render () {
        /* eslint-disable */
        const { intl, ipfsLogs, ipfsPortsRequested, ipfsStartLogger, ipfsStatus, ipfsStopLogger,
            settingsActions, toggleIpfsDetailsModal } = this.props;
        /* eslint-disable */
        const { apiPort, gatewayPort, swarmPort, storagePath, isIpfsFormDirty } = this.state;

        return (
          <Dialog
            title={this.renderTitle()}
            actions={this.getActions()}
            open
            onRequestClose={toggleIpfsDetailsModal}
            titleStyle={{ padding: '0px' }}
            autoScrollBodyContent
          >
            {this.state.activeTab === IPFS_SETTINGS &&
              <IpfsOptionsForm
                apiPort={apiPort}
                gatewayPort={gatewayPort}
                intl={intl}
                ipfsApi={ipfsStatus.get('api')}
                ipfsPortsRequested={ipfsPortsRequested}
                onIpfsApiPortChange={this.onApiPortChange}
                onIpfsGatewayPortChange={this.onGatewayPortChange}
                onIpfsStorageChange={this.onStorageChange}
                onIpfsSwarmPortChange={this.onSwarmPortChange}
                storagePath={storagePath}
                style={{ height: '400px' }}
                swarmPort={swarmPort}
              />
            }
            {this.state.activeTab === IPFS_LOGS &&
              <LogsList
                logs={ipfsLogs}
                startLogger={ipfsStartLogger}
                stopLogger={ipfsStopLogger}
                style={{ height: '400px', overflowY: 'visible', margin: '0px', paddingTop: '10px' }}
              />
            }
          </Dialog>
        );
    }
}

IpfsDetailsModal.contextTypes = {
    muiTheme: PropTypes.shape()
};

IpfsDetailsModal.propTypes = {
    intl: PropTypes.shape().isRequired,
    ipfsBusyState: PropTypes.bool,
    ipfsLogs: PropTypes.shape().isRequired,
    ipfsPortsRequested: PropTypes.bool,
    ipfsSaveSettings: PropTypes.func,
    ipfsSetPorts: PropTypes.func,
    ipfsSettings: PropTypes.shape(),
    ipfsStart: PropTypes.func,
    ipfsStarting: PropTypes.bool,
    ipfsStartLogger: PropTypes.func,
    ipfsStatus: PropTypes.shape().isRequired,
    ipfsStop: PropTypes.func,
    ipfsStopLogger: PropTypes.func,
    toggleIpfsDetailsModal: PropTypes.func,
};

function mapStateToProps (state) {
    return {
        ipfsStarting: state.externalProcState.getIn(['ipfs', 'flags', 'ipfsStarting']),
        ipfsStatus: state.externalProcState.getIn(['ipfs', 'status']),
        ipfsLogs: state.externalProcState.getIn(['ipfs', 'logs']),
        ipfsSettings: state.settingsState.get('ipfs'),
        ipfsPortsRequested: state.externalProcState.getIn(['ipfs', 'portsRequested']),
        ipfsBusyState: state.externalProcState.getIn(['ipfs', 'flags', 'busyState']),
    }
}

export default connect(
    mapStateToProps,
    {
        ipfsSaveSettings,
        ipfsSetPorts,
        ipfsStart,
        ipfsStartLogger,
        ipfsStop,
        ipfsStopLogger,
        toggleIpfsDetailsModal
    }
)(injectIntl(IpfsDetailsModal));
