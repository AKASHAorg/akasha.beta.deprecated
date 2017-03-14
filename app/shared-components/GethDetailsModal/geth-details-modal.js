import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Dialog, FlatButton, Tab, Tabs, Toggle } from 'material-ui';
import { GethOptionsForm, LogsList } from 'shared-components';
import { generalMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import { gethPauseSync, gethResumeSync, gethStart, gethStartLogger, gethStop,
    gethStopLogger } from 'local-flux/actions/external-process-actions'; // eslint-disable-line import/no-unresolved, import/extensions
import { toggleGethDetailsModal } from 'local-flux/actions/app-actions'; // eslint-disable-line import/no-unresolved, import/extensions
import { gethSaveSettings } from 'local-flux/actions/settings-actions'; // eslint-disable-line import/no-unresolved, import/extensions

const toggleStyle = {
    display: 'block',
    flex: '0 0 auto',
    width: 'auto',
    marginLeft: '10px'
};

const GETH_LOGS = 'GETH_LOGS';
const GETH_SETTINGS = 'GETH_SETTINGS';

class GethDetailsModal extends Component {
    state = {
        activeTab: GETH_SETTINGS,
        autoDag: this.props.gethSettings.get('autodag') === '',
        cache: this.props.gethSettings.get('cache'),
        fast: this.props.gethSettings.get('fast') === '',
        isGethFormDirty: false,
        mine: this.props.gethSettings.get('mine') === '',
        minerThreads: this.props.gethSettings.get('minerthreads') || 1,
    };

    onToggle = () => {
        /* eslint-disable */
        const { gethPauseSync, gethStart, gethStatus, gethStop } = this.props;
        /* eslint-disable */
        if (this.isGethOn()) {
            gethStop();
            gethPauseSync();
        } else {
            gethStart();
        }
    };

    onCacheChange = (event, index, value) => {
        this.setState({
            cache: value,
            isGethFormDirty: true
        });
    };

    onMineChange = () => {
        this.setState({
            mine: !this.state.mine,
            isGethFormDirty: true
        });
    };

    onAutodagChange = () => {
        this.setState({
            autoDag: !this.state.autoDag,
            isGethFormDirty: true
        });
    };

    onFastChange = () => {
        this.setState({
            fast: !this.state.fast,
            isGethFormDirty: true
        });
    };

    onMinerThreadsChange = (event, index, value) => {
        this.setState({
            minerThreads: value,
            isGethFormDirty: true
        });
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
        const { gethBusyState, intl, toggleGethDetailsModal } = this.props;
        return (<div style={{ display: 'flex' }}>
          <div style={{ flex: '0 0 auto', height: '36px', display: 'flex', alignItems: 'center' }}>
            <Toggle
              label={this.isGethOn() ?
                  intl.formatMessage(generalMessages.gethServiceOn) :
                  intl.formatMessage(generalMessages.gethServiceOff)
              }
              labelPosition="right"
              labelStyle={{ textAlign: 'left', width: 'calc(100% - 44px)' }}
              toggled={this.isGethOn()}
              onToggle={this.onToggle}
              disabled={gethBusyState}
              style={toggleStyle}
            />
          </div>
          <div style={{ flex: '1 1 auto' }} >
            <FlatButton
              label={intl.formatMessage(generalMessages.cancel)}
              onClick={toggleGethDetailsModal}
            />
            <FlatButton
              label={intl.formatMessage(generalMessages.save)}
              disabled={!this.state.isGethFormDirty}
              onClick={this.saveOptions}
            />
          </div>
        </div>);
    }

    isGethOn = () => {
        const { gethStarting, gethStatus } = this.props;
        return gethStatus.get('spawned') || gethStatus.get('starting') || gethStarting;
    }

    selectTab = (tab) => {
        this.setState({
            activeTab: tab
        });
    };

    saveOptions = () => {
        const { cache, mine, autoDag, fast, minerThreads } = this.state;

        this.props.gethSaveSettings({
            cache,
            mine: mine ? '' : false,
            autodag: (mine && autoDag) ? '' : false,
            fast: (mine && fast) ? '' : false,
            minerthreads: mine ? minerThreads : null
        }, true);
        this.setState({
            isGethFormDirty: false,
        });
    };

    renderTitle () {
        const { palette } = this.context.muiTheme;

        return (
          <div style={{ width: '100%' }}>
            <Tabs
              tabItemContainerStyle={{ width: '100%' }}
              onChange={this.selectTab}
              value={this.state.activeTab}
              inkBarStyle={{ backgroundColor: palette.primary1Color, zIndex: 2 }}
            >
              <Tab
                label="Settings"
                style={this.getTitleButtonStyle(GETH_SETTINGS)}
                value={GETH_SETTINGS}
              />
              <Tab
                label="Logs"
                style={this.getTitleButtonStyle(GETH_LOGS)}
                value={GETH_LOGS}
              />
            </Tabs>
          </div>
        );
    }

    render () {
        const { gethStartLogger, gethStopLogger, gethSettings, gethLogs, intl,
            toggleGethDetailsModal } = this.props;
        const { cache, mine, autoDag, fast, minerThreads, isGethFormDirty } = this.state;

        return (
          <Dialog
            title={this.renderTitle()}
            actions={this.getActions()}
            open
            onRequestClose={toggleGethDetailsModal}
            contentStyle={{ paddingBottom: '0px' }}
            titleStyle={{ padding: '0px' }}
            autoScrollBodyContent
          >
            {this.state.activeTab === GETH_SETTINGS &&
              <GethOptionsForm
                intl={intl}
                gethSettings={gethSettings}
                settingsActions={{}}
                style={{ height: '400px' }}
                onMineChange={this.onMineChange}
                onCacheChange={this.onCacheChange}
                onAutodagChange={this.onAutodagChange}
                onFastChange={this.onFastChange}
                onMinerThreadsChange={this.onMinerThreadsChange}
                cache={cache}
                mine={mine}
                autoDag={autoDag}
                fast={fast}
                minerThreads={minerThreads}
              />
            }
            {this.state.activeTab === GETH_LOGS &&
              <LogsList
                logs={gethLogs}
                startLogger={gethStartLogger}
                stopLogger={gethStopLogger}
                style={{ height: '400px', overflowY: 'visible', margin: '0px', paddingTop: '10px' }}
              />
            }
          </Dialog>
        );
    }
}

GethDetailsModal.contextTypes = {
    muiTheme: PropTypes.shape()
};

GethDetailsModal.propTypes = {
    gethBusyState: PropTypes.bool,
    gethLogs: PropTypes.shape().isRequired,
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

function mapStateToProps (state, ownProps) {
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
