import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { SvgIcon, FlatButton, Dialog, Toggle, IconButton, Tab, Tabs } from 'material-ui';
import { StatusBarEthereum, StatusBarIpfs } from 'shared-components/svg';
import { LogsList } from 'shared-components';
import ServiceState from 'constants/ServiceState';
import { EProcActions, SettingsActions } from 'local-flux';
import { generalMessages } from 'locale-data/messages';
import GethOptionsForm from './geth-options-form';
import IpfsOptionsForm from './ipfs-options-form';

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
const toggleStyle = {
    display: 'block',
    flex: '0 0 auto',
    width: 'auto',
    marginLeft: '10px'
};

const GETH_SETTINGS = 'GETH_SETTINGS';
const GETH_LOGS = 'GETH_LOGS';
const IPFS_SETTINGS = 'IPFS_SETTINGS';
const IPFS_LOGS = 'IPFS_LOGS';

class ServiceStatusBar extends Component {
    constructor (props) {
        super(props);

        this.state = {
            activeTab: null,
            isGethDialogOpen: false,
            isIpfsDialogOpen: false,
            gethToggled: props.gethStatus.get('spawned'),
            ipfsToggled: props.ipfsStatus.get('spawned'),
            cache: props.gethSettings.get('cache'),
            mine: props.gethSettings.get('mine') === '',
            autoDag: props.gethSettings.get('autodag') === '',
            fast: props.gethSettings.get('fast') === '',
            minerThreads: props.gethSettings.get('minerthreads') || 1,
            isGethFormDirty: false,
            showGethSuccessMessage: false,
            storagePath: props.ipfsSettings.get('storagePath'),
            isIpfsFormDirty: false,
            showIpfsSuccessMessage: false
        };
    }

    componentWillMount () {
        const { eProcActions } = this.props;
        eProcActions.getGethStatus();
        eProcActions.getIpfsStatus();
    }

    componentWillReceiveProps (nextProps) {
        const { gethSettings, ipfsSettings } = this.props;
        const nextGethSettings = nextProps.gethSettings;
        const nextIpfsSettings = nextProps.ipfsSettings;
        if (JSON.stringify(gethSettings.toJS()) !== JSON.stringify(nextGethSettings.toJS())) {
            this.setState({
                cache: nextProps.gethSettings.get('cache'),
                mine: nextProps.gethSettings.get('mine') === '',
                autoDag: nextProps.gethSettings.get('autodag') === '',
                fast: nextProps.gethSettings.get('fast') === '',
                minerThreads: nextProps.gethSettings.get('minerthreads') || 1,
                showGethSuccessMessage: this.state.isGethDialogOpen
            });
        }
        if (ipfsSettings.toJS().storagePath !== nextIpfsSettings.toJS().storagePath) {
            this.setState({
                storagePath: nextIpfsSettings.get('storagePath'),
                showIpfsSuccessMessage: this.state.isIpfsDialogOpen
            });
        }
        if (nextProps.gethStatus.get('spawned') !== this.props.gethStatus.get('spawned')) {
            this.setState({
                gethToggled: nextProps.gethStatus.get('spawned')
            });
        }
        if (nextProps.ipfsStatus.get('spawned') !== this.props.ipfsStatus.get('spawned')) {
            this.setState({
                ipfsToggled: nextProps.ipfsStatus.get('spawned')
            });
        }
    }

    getContainerStyle (state) {
        const { muiTheme } = this.context;
        const style = Object.assign({}, containerStyle);
        switch (state) {
            case ServiceState.stopped:
                style.borderColor = muiTheme.palette.accent1Color;
                break;
            case ServiceState.starting:
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

    getGethState () {
        const { gethStatus } = this.props;
        let gethState = ServiceState.stopped;

        if (gethStatus.get('api') && !gethStatus.get('stopped')) {
            gethState = ServiceState.started;
        } else if (gethStatus.get('spawned') || gethStatus.get('starting')
                || gethStatus.get('downloading') || gethStatus.get('api')) {
            gethState = ServiceState.starting;
        }
        return gethState;
    }

    getGethTooltip () {
        const { intl, gethStatus } = this.props;

        if (gethStatus.get('api') && !gethStatus.get('stopped')) {
            return intl.formatMessage(generalMessages.running);
        } else if (gethStatus.get('starting') || gethStatus.get('spawned')) {
            return intl.formatMessage(generalMessages.starting);
        } else if (gethStatus.get('downloading')) {
            return intl.formatMessage(generalMessages.downloading);
        }
        return intl.formatMessage(generalMessages.stopped);
    }

    getIpfsState () {
        const { ipfsStatus } = this.props;
        let ipfsState = ServiceState.stopped;

        if (ipfsStatus.get('spawned') || ipfsStatus.get('started')) {
            ipfsState = ServiceState.started;
        } else if (ipfsStatus.get('downloading')) {
            ipfsState = ServiceState.starting;
        }
        return ipfsState;
    }

    getIpfsTooltip () {
        const { intl, ipfsStatus } = this.props;

        if (ipfsStatus.get('spawned') || ipfsStatus.get('started')) {
            return intl.formatMessage(generalMessages.running);
        } else if (ipfsStatus.get('downloading')) {
            return intl.formatMessage(generalMessages.downloading);
        }
        return intl.formatMessage(generalMessages.stopped);
    }

    openGethDialog = () => {
        this.setState({
            activeTab: GETH_SETTINGS,
            isGethDialogOpen: true
        });
    };

    openIpfsDialog = () => {
        this.setState({
            activeTab: IPFS_SETTINGS,
            isIpfsDialogOpen: true
        });
    };

    closeGethDialog = () => {
        this.setState({
            isGethDialogOpen: false,
            activeTab: null,
            cache: this.props.gethSettings.get('cache'),
            mine: this.props.gethSettings.get('mine') === '',
            autoDag: this.props.gethSettings.get('autodag') === '',
            fast: this.props.gethSettings.get('fast') === '',
            minerThreads: this.props.gethSettings.get('minerthreads') || 1,
            isGethFormDirty: false,
            showGethSuccessMessage: false
        });
    };

    closeIpfsDialog = () => {
        this.setState({
            isIpfsDialogOpen: false,
            activeTab: null,
            storagePath: this.props.ipfsSettings.get('storagePath'),
            isIpfsFormDirty: false,
            showIpfsSuccessMessage: false
        });
    };

    onGethToggle = () => {
        const { eProcActions, gethSettings, gethStatus } = this.props;
        const { gethToggled } = this.state;
        if (gethToggled) {
            if (!gethStatus.get('synced')) {
                eProcActions.pauseSync();
            } else {
                eProcActions.stopGeth();
            }
        } else {
            if (!gethStatus.get('synced')) {
                eProcActions.startSync();
            }
            const options = gethSettings.toJS();
            if (options && options.ipcpath) {
                options.ipcpath = options.ipcpath.replace('\\\\.\\pipe\\', '');
            }
            eProcActions.startGeth(options);
        }
        this.setState({
            gethToggled: !gethToggled
        });
    };

    onIpfsToggle = () => {
        const { eProcActions } = this.props;
        const { ipfsToggled } = this.state;
        if (ipfsToggled) {
            eProcActions.stopIPFS();
        } else {
            eProcActions.startIPFS();
        }
        this.setState({
            ipfsToggled: !ipfsToggled
        });
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

    onIpfsStorageChange = (ev) => {
        ev.stopPropagation();
        ev.target.blur();
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;
        input.addEventListener('change', (e) => {
            this.setState({
                storagePath: e.target.files[0].path,
                isIpfsFormDirty: true
            });
        });
        input.click();
    };

    saveGethOptions = () => {
        const { settingsActions } = this.props;
        const { cache, mine, autoDag, fast, minerThreads } = this.state;

        settingsActions.saveSettings('geth', {
            cache,
            mine: mine ? '' : false,
            autodag: (mine && autoDag) ? '' : false,
            fast: (mine && fast) ? '' : false,
            minerthreads: mine ? minerThreads : null
        });
        this.setState({
            isGethFormDirty: false,
            showGethSuccessMessage: false
        });
    };

    saveIpfsOptions = () => {
        const { settingsActions } = this.props;
        const { storagePath } = this.state;

        settingsActions.saveSettings('ipfs', { storagePath });
        this.setState({
            showIpfsSuccessMessage: false,
            isIpfsFormDirty: false
        });
    };

    selectTab = (tab) => {
        this.setState({
            activeTab: tab
        });
    };

    getGethActions () {
        const { intl, gethBusyState, disableStopService } = this.props;
        return (<div style={{ display: 'flex' }}>
          <div style={{ flex: '0 0 auto', height: '36px', display: 'flex', alignItems: 'center' }}>
            <Toggle
              label={this.state.gethToggled ?
                  intl.formatMessage(generalMessages.gethServiceOn) :
                  intl.formatMessage(generalMessages.gethServiceOff)
              }
              labelPosition="right"
              labelStyle={{ textAlign: 'left', width: 'calc(100% - 44px)' }}
              toggled={this.state.gethToggled}
              onToggle={this.onGethToggle}
              disabled={gethBusyState || (disableStopService && this.state.gethToggled)}
              style={toggleStyle}
            />
          </div>
          <div style={{ flex: '1 1 auto' }} >
            <FlatButton
              label={intl.formatMessage(generalMessages.cancel)}
              onClick={this.closeGethDialog}
            />
            <FlatButton
              label={intl.formatMessage(generalMessages.save)}
              disabled={!this.state.isGethFormDirty}
              onClick={this.saveGethOptions}
            />
          </div>
        </div>);
    }

    getIpfsActions () {
        const { intl, ipfsBusyState, disableStopService } = this.props;
        return (<div style={{ display: 'flex' }}>
          <div style={{ flex: '0 0 auto', height: '36px', display: 'flex', alignItems: 'center' }}>
            <Toggle
              label={this.state.ipfsToggled ?
                  intl.formatMessage(generalMessages.ipfsServiceOn) :
                  intl.formatMessage(generalMessages.ipfsServiceOff)
              }
              labelPosition="right"
              labelStyle={{ textAlign: 'left', width: 'calc(100% - 44px)' }}
              toggled={this.state.ipfsToggled}
              onToggle={this.onIpfsToggle}
              disabled={ipfsBusyState || (disableStopService && this.state.ipfsToggled)}
              style={toggleStyle}
            />
          </div>
          <div style={{ flex: '1 1 auto' }} >
            <FlatButton
              label={intl.formatMessage(generalMessages.cancel)}
              onClick={this.closeIpfsDialog}
            />
            <FlatButton
              label={intl.formatMessage(generalMessages.save)}
              disabled={!this.state.isIpfsFormDirty}
              onClick={this.saveIpfsOptions}
            />
          </div>
        </div>);
    }

    renderGethTitle () {
        const { palette } = this.context.muiTheme;
        const settingsBarColor = this.state.activeTab === GETH_SETTINGS ?
            palette.accent1Color :
            palette.primary1Color;
        const logsBarColor = this.state.activeTab === GETH_LOGS ?
            palette.accent1Color :
            palette.primary1Color;

        return (<div style={{ width: '100%' }}>
          <Tabs
            tabItemContainerStyle={{ width: '100%' }}
            onChange={this.selectTab}
            value={this.state.activeTab}
            inkBarStyle={{ backgroundColor: palette.primary1Color }}
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
        </div>);
    }

    renderGethDialog () {
        const { intl, settingsActions, gethSettings, eProcActions, timestamp,
            gethLogs } = this.props;
        const { cache, mine, autoDag, fast, minerThreads, isGethFormDirty,
            showGethSuccessMessage } = this.state;
        return (<Dialog
          title={this.renderGethTitle()}
          actions={this.getGethActions()}
          open={this.state.isGethDialogOpen}
          onRequestClose={this.closeGethDialog}
          contentStyle={{ paddingBottom: '0px' }}
          titleStyle={{ padding: '0px' }}
          autoScrollBodyContent
        >
          {this.state.activeTab === GETH_SETTINGS &&
            <GethOptionsForm
              intl={intl}
              gethSettings={gethSettings}
              settingsActions={settingsActions}
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
              showSuccessMessage={showGethSuccessMessage && !isGethFormDirty}
            />
          }
          {this.state.activeTab === GETH_LOGS &&
            <LogsList
              eProcActions={eProcActions}
              logs={gethLogs}
              style={{ height: '400px', overflowY: 'visible', margin: '0px', paddingTop: '10px' }}
              timestamp={timestamp}
              type="geth"
            />
          }
        </Dialog>);
    }

    renderIpfsTitle () {
        const { palette } = this.context.muiTheme;
        const settingsBarColor = this.state.activeTab === IPFS_SETTINGS ?
            palette.accent1Color :
            palette.primary1Color;
        const logsBarColor = this.state.activeTab === IPFS_LOGS ?
            palette.accent1Color :
            palette.primary1Color;

        return (<div style={{ width: '100%' }}>
          <Tabs
            tabItemContainerStyle={{ width: '100%' }}
            onChange={this.selectTab}
            value={this.state.activeTab}
            inkBarStyle={{ backgroundColor: palette.primary1Color }}
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

    renderIpfsDialog () {
        const { eProcActions, intl, ipfsLogs, ipfsSettings, settingsActions,
            timestamp } = this.props;
        const { storagePath, showIpfsSuccessMessage, isIpfsFormDirty } = this.state;
        return (<Dialog
          title={this.renderIpfsTitle()}
          actions={this.getIpfsActions()}
          open={this.state.isIpfsDialogOpen}
          onRequestClose={this.closeIpfsDialog}
          titleStyle={{ padding: '0px' }}
          autoScrollBodyContent
        >
          {this.state.activeTab === IPFS_SETTINGS &&
            <IpfsOptionsForm
              intl={intl}
              ipfsSettings={ipfsSettings}
              settingsActions={settingsActions}
              style={{ height: '400px' }}
              storagePath={storagePath}
              onIpfsStorageChange={this.onIpfsStorageChange}
              showSuccessMessage={showIpfsSuccessMessage && !isIpfsFormDirty}
            />
          }
          {this.state.activeTab === IPFS_LOGS &&
            <LogsList
              eProcActions={eProcActions}
              logs={ipfsLogs}
              style={{ height: '400px', overflowY: 'visible', margin: '0px', paddingTop: '10px' }}
              timestamp={timestamp}
              type="ipfs"
            />
          }
        </Dialog>);
    }

    render () {
        const { palette } = this.context.muiTheme;
        const iconStyle = {
            width: '24px',
            height: '24px',
            color: palette.textColor,
            position: 'relative',
            top: '4px'
        };
        const ethereumIcon =
          (<SvgIcon viewBox="0 0 16 16">
            <StatusBarEthereum />
          </SvgIcon>);
        const ipfsIcon =
          (<SvgIcon viewBox="0 0 16 16">
            <StatusBarIpfs />
          </SvgIcon>);
        return (<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {this.props.gethStatus &&
            <div style={this.getContainerStyle(this.getGethState())}>
              <IconButton
                style={buttonStyle}
                onClick={this.openGethDialog}
                tooltip={this.getGethTooltip()}
                iconStyle={iconStyle}
              >
                {ethereumIcon}
              </IconButton>
              {this.renderGethDialog()}
            </div>
          }
          {this.props.ipfsStatus &&
            <div style={this.getContainerStyle(this.getIpfsState())}>
              <IconButton
                style={buttonStyle}
                onClick={this.openIpfsDialog}
                tooltip={this.getIpfsTooltip()}
                iconStyle={iconStyle}
              >
                {ipfsIcon}
              </IconButton>
              {this.renderIpfsDialog()}
            </div>
          }
        </div>);
    }
}

ServiceStatusBar.propTypes = {
    gethStatus: PropTypes.shape().isRequired,
    gethLogs: PropTypes.shape().isRequired,
    ipfsStatus: PropTypes.shape().isRequired,
    ipfsLogs: PropTypes.shape().isRequired,
    gethSettings: PropTypes.shape(),
    ipfsSettings: PropTypes.shape(),
    gethBusyState: PropTypes.bool,
    ipfsBusyState: PropTypes.bool,
    eProcActions: PropTypes.shape().isRequired,
    settingsActions: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    timestamp: PropTypes.number
};

ServiceStatusBar.contextTypes = {
    muiTheme: PropTypes.shape().isRequired
};

function mapStateToProps (state, ownProps) {
    return {
        gethStatus: state.externalProcState.get('gethStatus'),
        gethLogs: state.externalProcState.get('gethLogs'),
        ipfsStatus: state.externalProcState.get('ipfsStatus'),
        ipfsLogs: state.externalProcState.get('ipfsLogs'),
        gethSettings: state.settingsState.get('geth'),
        ipfsSettings: state.settingsState.get('ipfs'),
        syncActionId: state.externalProcState.get('syncActionId'),
        gethBusyState: state.externalProcState.get('gethBusyState'),
        ipfsBusyState: state.externalProcState.get('ipfsBusyState'),
        timestamp: state.appState.get('timestamp'),
        disableStopService: ownProps.disableStopService
    };
}

function mapDispatchToProps (dispatch) {
    return {
        eProcActions: new EProcActions(dispatch),
        settingsActions: new SettingsActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(ServiceStatusBar));
