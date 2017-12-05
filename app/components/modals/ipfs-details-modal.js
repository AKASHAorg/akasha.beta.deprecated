import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Tabs } from 'antd';
import { generalMessages, setupMessages } from '../../locale-data/messages';
import { ipfsSetPorts, ipfsStart, ipfsStartLogger, ipfsStop,
    ipfsStopLogger } from '../../local-flux/actions/external-process-actions';
import { toggleIpfsDetailsModal } from '../../local-flux/actions/app-actions';
import { ipfsSaveSettings } from '../../local-flux/actions/settings-actions';
import { InputNumber, LogsList, PathInputField, ServiceDetailsModal } from '../';

const { TabPane } = Tabs;
const SETTINGS = 'SETTINGS';
const LOGS = 'LOGS';

class IpfsDetailsModal extends Component {
    state = {
        activeTab: SETTINGS,
        apiPort: this.props.ipfsSettings.getIn(['ports', 'apiPort']),
        gatewayPort: this.props.ipfsSettings.getIn(['ports', 'gatewayPort']),
        isFormDirty: false,
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
        if (this.isIpfsOn()) {
            this.props.ipfsStop();
        } else {
            this.props.ipfsStart();
        }
    };

    onApiPortChange = (value) => {
        this.setState({
            apiPort: value,
            isFormDirty: true
        });
    };

    onGatewayPortChange = (value) => {
        this.setState({
            gatewayPort: value,
            isFormDirty: true
        });
    };

    onSwarmPortChange = (value) => {
        this.setState({
            swarmPort: value,
            isFormDirty: true
        });
    };

    onStorageChange = (path) => {
        const { ipfsSettings } = this.props;
        this.setState({
            storagePath: path,
            isFormDirty: true
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

    selectTab = (tab) => {
        this.setState({
            activeTab: tab
        });
    };

    saveOptions = () => {
        const { ipfsSettings, ipfsStatus } = this.props;
        const { apiPort, gatewayPort, swarmPort, storagePath } = this.state;
        const ports = {
            api: Number(apiPort) || null,
            gateway: Number(gatewayPort) || null,
            swarm: Number(swarmPort) || null
        };
        if (storagePath !== ipfsSettings.get('storagePath')) {
            this.props.ipfsSaveSettings({ storagePath }, true);
        } else if (ipfsStatus.get('api')) {
            this.props.ipfsSetPorts(ports);
        }
        this.setState({
            isFormDirty: false
        });
    };

    isIpfsOn = () => {
        const { ipfsStarting, ipfsStatus } = this.props;
        return ipfsStatus.get('process') || ipfsStatus.get('starting') || ipfsStarting;
    }

    renderModalContent = () => {
        const { intl, ipfsLogs, ipfsPortsRequested, ipfsStatus } = this.props;
        const { activeTab, apiPort, gatewayPort, swarmPort, storagePath } = this.state;
        const ipfsApi = ipfsStatus.get('api');

        return (
          <div className="service-details-modal ipfs-details-modal">
            <Tabs
              activeKey={activeTab}
              onChange={this.selectTab}
              tabBarStyle={{ height: '60px', marginBottom: '0px' }}
              type="card"
            >
              <TabPane key={SETTINGS} tab={intl.formatMessage(generalMessages.settings)}>
                <div className="service-details-modal__tab-pane">
                  <PathInputField
                    label={intl.formatMessage(setupMessages.ipfsStoragePath)}
                    onChange={this.onStorageChange}
                    size="large"
                    value={storagePath}
                  />
                  <div className="ipfs-details-modal__ports">
                    {apiPort &&
                      <InputNumber
                        label={intl.formatMessage(setupMessages.ipfsApiPort)}
                        value={apiPort}
                        onChange={this.onApiPortChange}
                        disabled={!ipfsApi || ipfsPortsRequested}
                        size="large"
                        style={{ width: '100%' }}
                        wrapperStyle={{ width: '48%', margin: '12px 0px' }}
                      />
                    }
                    {gatewayPort &&
                      <InputNumber
                        label={intl.formatMessage(setupMessages.ipfsGatewayPort)}
                        value={gatewayPort}
                        onChange={this.onGatewayPortChange}
                        disabled={!ipfsApi || ipfsPortsRequested}
                        size="large"
                        style={{ width: '100%' }}
                        wrapperStyle={{ width: '48%', margin: '12px 0px' }}
                      />
                    }
                    {swarmPort &&
                      <InputNumber
                        label={intl.formatMessage(setupMessages.ipfsSwarmPort)}
                        value={swarmPort}
                        onChange={this.onSwarmPortChange}
                        disabled={!ipfsApi || ipfsPortsRequested}
                        size="large"
                        style={{ width: '100%' }}
                        wrapperStyle={{ width: '48%', margin: '12px 0px' }}
                      />
                    }
                  </div>
                </div>
              </TabPane>
              <TabPane key={LOGS} tab={intl.formatMessage(generalMessages.logs)}>
                <div className="service-details-modal__tab-pane service-details-modal__tab-pane_logs">
                  {activeTab === LOGS &&
                    <LogsList
                      logs={ipfsLogs}
                      modal
                      startLogger={this.props.ipfsStartLogger}
                      stopLogger={this.props.ipfsStopLogger}
                    />
                  }
                </div>
              </TabPane>
            </Tabs>
          </div>
        );
    };

    render () {
        const { ipfsBusyState, ipfsStatus, intl } = this.props;
        const { isFormDirty } = this.state;
        const toggleDisabled = ipfsBusyState || ipfsStatus.get('downloading') || ipfsStatus.get('upgrading');

        const isIpfsOn = this.isIpfsOn();
        const toggleLabel = isIpfsOn ?
            intl.formatMessage(generalMessages.ipfsServiceOn) :
            intl.formatMessage(generalMessages.ipfsServiceOff);

        return (
          <ServiceDetailsModal
            onCancel={this.props.toggleIpfsDetailsModal}
            onSave={this.saveOptions}
            onToggle={this.onToggle}
            saveDisabled={!isFormDirty}
            toggleDisabled={toggleDisabled}
            toggleLabel={toggleLabel}
            toggleOn={isIpfsOn}
          >
            {this.renderModalContent()}
          </ServiceDetailsModal>
        );
    }
}

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
    };
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
