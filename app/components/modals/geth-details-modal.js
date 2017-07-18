import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Tabs } from 'antd';
import { generalMessages, setupMessages } from '../../locale-data/messages';
import { toggleGethDetailsModal } from '../../local-flux/actions/app-actions';
import { gethPauseSync, gethResumeSync, gethStart, gethStartLogger, gethStop,
    gethStopLogger } from '../../local-flux/actions/external-process-actions';
import { gethSaveSettings } from '../../local-flux/actions/settings-actions';
import { GethCacheSelect, Input, LogsList, PathInputField, ServiceDetailsModal } from '../';
import styles from './service-details-modal.scss';

const { TabPane } = Tabs;

const LOGS = 'LOGS';
const SETTINGS = 'SETTINGS';

class GethDetailsModal extends Component {
    state = {
        activeTab: SETTINGS,
        cache: this.props.gethSettings.get('cache').toString(),
        datadir: this.props.gethSettings.get('datadir'),
        isFormDirty: false,
    };

    onToggle = () => {
        /* eslint-disable */
        const { gethPauseSync, gethStart, gethStatus, gethStop } = this.props;
        /* eslint-enable */
        if (this.isGethOn()) {
            gethStop();
            gethPauseSync();
        } else {
            gethStart();
        }
    };

    onCacheChange = (value) => {
        this.setState({
            cache: value,
            isFormDirty: true
        });
    };

    onDatadirChange = (datadir) => {
        this.setState({
            datadir,
            isFormDirty: true
        });
    }

    isGethOn = () => {
        const { gethStarting, gethStatus } = this.props;
        return gethStatus.get('process') || gethStatus.get('starting') || gethStarting;
    }

    selectTab = (tab) => {
        this.setState({
            activeTab: tab
        });
    };

    saveOptions = () => {
        const { cache, datadir } = this.state;

        this.props.gethSaveSettings({
            cache: Number(cache),
            datadir
        }, true);
        this.setState({
            isFormDirty: false,
        });
    };

    renderModalContent = () => {
        const { gethSettings, gethLogs, intl } = this.props;
        const { activeTab, cache, datadir } = this.state;

        return (
          <div className="service-details-modal" style={{ height: '400px' }}>
            <Tabs
              activeKey={activeTab}
              onChange={this.selectTab}
              tabBarStyle={{ height: '60px', marginBottom: '0px' }}
              type="card"
            >
              <TabPane key={SETTINGS} tab={intl.formatMessage(generalMessages.settings)}>
                <div className={styles.tabPane}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '-20px' }}>
                    <GethCacheSelect
                      onChange={this.onCacheChange}
                      style={{ width: '100%' }}
                      value={cache}
                      wrapperStyle={{ width: '48%' }}
                    />
                    <Input
                      label={intl.formatMessage(setupMessages.gethNetworkId)}
                      readOnly
                      size="large"
                      value={gethSettings.get('networkid') || ''}
                      wrapperStyle={{ width: '48%' }}
                    />
                  </div>
                  <PathInputField
                    label={intl.formatMessage(setupMessages.gethDataDirPath)}
                    onChange={this.onDatadirChange}
                    readOnly
                    size="large"
                    value={datadir}
                  />
                  <PathInputField
                    disabled
                    label={intl.formatMessage(setupMessages.gethIPCPath)}
                    readOnly
                    size="large"
                    value={gethSettings.get('ipcpath')}
                  />
                </div>
              </TabPane>
              <TabPane key={LOGS} tab={intl.formatMessage(generalMessages.logs)}>
                <div className={styles.tabPane} style={{ padding: '10px 8px 0px' }}>
                  {activeTab === LOGS &&
                    <LogsList
                      logs={gethLogs}
                      startLogger={this.props.gethStartLogger}
                      stopLogger={this.props.gethStopLogger}
                      style={{ height: '100%', overflowY: 'auto', margin: '0px', padding: '0 16px' }}
                    />
                  }
                </div>
              </TabPane>
            </Tabs>
          </div>
        );
    };

    render () {
        const { gethBusyState, gethStatus, intl } = this.props;
        const { isFormDirty } = this.state;
        const toggleDisabled = gethBusyState || gethStatus.get('downloading') || gethStatus.get('upgrading');
        const isGethOn = this.isGethOn();
        const toggleLabel = isGethOn ?
            intl.formatMessage(generalMessages.gethServiceOn) :
            intl.formatMessage(generalMessages.gethServiceOff);

        return (
          <ServiceDetailsModal
            onCancel={this.props.toggleGethDetailsModal}
            onSave={this.saveOptions}
            onToggle={this.onToggle}
            saveDisabled={!isFormDirty}
            toggleDisabled={toggleDisabled}
            toggleLabel={toggleLabel}
            toggleOn={isGethOn}
          >
            {this.renderModalContent()}
          </ServiceDetailsModal>
        );
    }
}

GethDetailsModal.contextTypes = {
    muiTheme: PropTypes.shape()
};

GethDetailsModal.propTypes = {
    gethBusyState: PropTypes.bool,
    gethLogs: PropTypes.shape().isRequired,
    gethSaveSettings: PropTypes.func.isRequired,
    gethSettings: PropTypes.shape(),
    gethStart: PropTypes.func,
    gethStarting: PropTypes.bool,
    gethStartLogger: PropTypes.func,
    gethStatus: PropTypes.shape().isRequired,
    gethStop: PropTypes.func,
    gethStopLogger: PropTypes.func,
    intl: PropTypes.shape().isRequired,
    toggleGethDetailsModal: PropTypes.func,
};

function mapStateToProps (state) {
    return {
        gethBusyState: state.externalProcState.getIn(['geth', 'flags', 'busyState']),
        gethLogs: state.externalProcState.getIn(['geth', 'logs']),
        gethSettings: state.settingsState.get('geth'),
        gethStarting: state.externalProcState.getIn(['geth', 'flags', 'gethStarting']),
        gethStatus: state.externalProcState.getIn(['geth', 'status']),
        syncActionId: state.externalProcState.getIn(['geth', 'syncActionId']),
    };
}

export default connect(
    mapStateToProps,
    {
        gethPauseSync,
        gethResumeSync,
        gethSaveSettings,
        gethStart,
        gethStartLogger,
        gethStop,
        gethStopLogger,
        toggleGethDetailsModal,
    }
)(injectIntl(GethDetailsModal));
