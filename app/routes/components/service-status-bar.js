import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { SvgIcon, FlatButton, Dialog, Toggle } from 'material-ui';
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
    borderRadius: '16px'
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
            isIpfsDialogOpen: false
        };
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
            border: 'none',
            outline: 'none',
            color: this.state.activeTab === tab ? palette.alternateTextColor : palette.disabledColor,
            backgroundColor: palette.primary1Color,
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

        if (gethStatus.get('api')) {
            gethState = ServiceState.started;
        } else if (gethStatus.get('spawned') || gethStatus.get('starting')
                || gethStatus.get('downloading')) {
            gethState = ServiceState.starting;
        }
        return gethState;
    }

    getIpfsState () {
        const { ipfsStatus } = this.props;
        let ipfsState = ServiceState.stopped;

        if (ipfsStatus.get('spawned')) {
            ipfsState = ServiceState.started;
        } else if (ipfsStatus.get('starting') || ipfsStatus.get('downloading')) {
            ipfsState = ServiceState.starting;
        }
        return ipfsState;
    }

    openGethDialog = () => {
        this.setState({
            activeTab: GETH_SETTINGS,
            isGethDialogOpen: true
        });
    }

    openIpfsDialog = () => {
        this.setState({
            activeTab: IPFS_SETTINGS,
            isIpfsDialogOpen: true
        });
    }

    closeGethDialog = () => {
        this.setState({
            isGethDialogOpen: false,
            activeTab: null
        });
    }

    closeIpfsDialog = () => {
        this.setState({
            isIpfsDialogOpen: false,
            activeTab: null
        });
    }

    onGethToggle = () => {
        const { eProcActions, gethSettings, gethStatus } = this.props;
        if (gethStatus.get('spawned')) {
            if (!gethStatus.get('synced')) {
                eProcActions.pauseSync();
            } else {
                eProcActions.stopGeth();
            }
        } else {
            if (!gethStatus.get('synced')) {
                eProcActions.startSync();
            }
            eProcActions.startGeth(gethSettings.toJS());
        }
    };

    onIpfsToggle = () => {
        const { eProcActions, ipfsStatus } = this.props;
        if (ipfsStatus.get('spawned')) {
            eProcActions.stopIPFS();
        } else {
            eProcActions.startIPFS();
        }
    };

    selectTab (tab) {
        this.setState({
            activeTab: tab
        });
    }

    getGethActions () {
        const { intl, gethBusyState, gethStatus } = this.props;
        return <div style={{ display: 'flex' }}>
          <div style={{ flex: '0 0 auto', height: '36px', display: 'flex', alignItems: 'center' }}>
            <Toggle
              label={gethStatus.get('spawned') ?
                  intl.formatMessage(generalMessages.gethServiceOn) :
                  intl.formatMessage(generalMessages.gethServiceOff)
              }
              labelPosition="right"
              labelStyle={{ textAlign: 'left', width: 'calc(100% - 44px)' }}
              toggled={gethStatus.get('spawned')}
              onToggle={this.onGethToggle}
              disabled={gethBusyState}
              style={toggleStyle}
            />
          </div>
          <div style={{ flex: '1 1 auto' }} >
            <FlatButton
              label={intl.formatMessage(generalMessages.cancel)}
              onClick={this.closeGethDialog}
            />
          </div>
        </div>;
    }

    getIpfsActions () {
        const { intl, ipfsBusyState, ipfsStatus } = this.props;
        return <div style={{ display: 'flex' }}>
          <div style={{ flex: '0 0 auto', height: '36px', display: 'flex', alignItems: 'center' }}>
            <Toggle
              label={ipfsStatus.get('spawned') ?
                  intl.formatMessage(generalMessages.ipfsServiceOn) :
                  intl.formatMessage(generalMessages.ipfsServiceOff)
              }
              labelPosition="right"
              labelStyle={{ textAlign: 'left', width: 'calc(100% - 44px)' }}
              toggled={ipfsStatus.get('spawned')}
              onToggle={this.onIpfsToggle}
              disabled={ipfsBusyState}
              style={toggleStyle}
            />
          </div>
          <div style={{ flex: '1 1 auto' }} >
            <FlatButton
              label={intl.formatMessage(generalMessages.cancel)}
              onClick={this.closeIpfsDialog}
            />
          </div>
        </div>;
    }

    renderIpfsErrors () {
        const { intl, ipfsErrors } = this.props;

        if (ipfsErrors.size === 0) {
            return <div style={{ padding: '20px 0' }}>
              {intl.formatMessage(generalMessages.noErrors)}
            </div>;
        }

        return ipfsErrors.map((error, key) =>
          <div key={key} style={{ margin: '10px 0', padding: '5px' }} >
            <span>
              {error.get('code')}
            </span>
            <span style={{ marginLeft: '5px' }}>
              {error.get('message')}
            </span>
          </div>
        );
    }

    renderGethTitle () {
        const { palette } = this.context.muiTheme;
        const settingsBarColor = this.state.activeTab === GETH_SETTINGS ?
            palette.accent1Color :
            palette.primary1Color;
        const logsBarColor = this.state.activeTab === GETH_LOGS ?
            palette.accent1Color :
            palette.primary1Color;

        return <div style={{ width: '100%' }}>
          <button style={this.getTitleButtonStyle(GETH_SETTINGS)} onClick={() => this.selectTab(GETH_SETTINGS)}>
            <div style={{ height: '46px', lineHeight: '46px' }}>Settings</div>
            <div style={{ height: '2px', backgroundColor: settingsBarColor }} />
          </button>
          <button style={this.getTitleButtonStyle(GETH_LOGS)} onClick={() => this.selectTab(GETH_LOGS)}>
            <div style={{ height: '46px', lineHeight: '46px' }}>Logs</div>
            <div style={{ height: '2px', backgroundColor: logsBarColor }} />
          </button>
        </div>;
    }

    renderGethDialog () {
        const { intl, settingsActions, gethSettings, eProcActions, timestamp,
            gethLogs } = this.props;

        return <Dialog
          title={this.renderGethTitle()}
          actions={this.getGethActions()}
          open={this.state.isGethDialogOpen}
          onRequestClose={this.closeGethDialog}
          contentStyle={{ minHeight: '500px' }}
          titleStyle={{ padding: '0px' }}
          autoScrollBodyContent
        >
          {this.state.activeTab === GETH_SETTINGS &&
            <GethOptionsForm
              intl={intl}
              gethSettings={gethSettings}
              settingsActions={settingsActions}
            />
          }
          {this.state.activeTab === GETH_LOGS &&
            <LogsList eProcActions={eProcActions} timestamp={timestamp} gethLogs={gethLogs} />
          }
        </Dialog>;
    }

    renderIpfsTitle () {
        const { palette } = this.context.muiTheme;
        const settingsBarColor = this.state.activeTab === IPFS_SETTINGS ?
            palette.accent1Color :
            palette.primary1Color;
        const logsBarColor = this.state.activeTab === IPFS_LOGS ?
            palette.accent1Color :
            palette.primary1Color;

        return <div style={{ width: '100%' }}>
          <button style={this.getTitleButtonStyle(IPFS_SETTINGS)} onClick={() => this.selectTab(IPFS_SETTINGS)}>
            <div style={{ height: '46px', lineHeight: '46px' }}>Settings</div>
            <div style={{ height: '2px', backgroundColor: settingsBarColor }} />
          </button>
          <button style={this.getTitleButtonStyle(IPFS_LOGS)} onClick={() => this.selectTab(IPFS_LOGS)}>
            <div style={{ height: '46px', lineHeight: '46px' }}>Logs</div>
            <div style={{ height: '2px', backgroundColor: logsBarColor }} />
          </button>
        </div>;
    }



    renderIpfsDialog () {
        const { intl, ipfsSettings, settingsActions } = this.props;

        return <Dialog
          title={this.renderIpfsTitle()}
          actions={this.getIpfsActions()}
          open={this.state.isIpfsDialogOpen}
          onRequestClose={this.closeIpfsDialog}
          contentStyle={{ minHeight: '500px' }}
          titleStyle={{ padding: '0px' }}
          autoScrollBodyContent
        >
          {this.state.activeTab === IPFS_SETTINGS &&
            <IpfsOptionsForm
              intl={intl}
              ipfsSettings={ipfsSettings}
              settingsActions={settingsActions}
            />
          }
          {this.state.activeTab === IPFS_LOGS && this.renderIpfsErrors()}
        </Dialog>;
    }

    render () {
        const { palette } = this.context.muiTheme;
        const iconStyle = {
            width: '24px',
            height: '24px',
            color: palette.textColor
        }
        const ethereumIcon =
          <SvgIcon viewBox="0 0 16 16" style={iconStyle}>
            <StatusBarEthereum />
          </SvgIcon>;
        const ipfsIcon =
          <SvgIcon viewBox="0 0 16 16" style={iconStyle}>
            <StatusBarIpfs />
          </SvgIcon>;
        return <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {this.props.gethStatus &&
            <div style={this.getContainerStyle(this.getGethState())}>
              <FlatButton
                icon={ethereumIcon}
                style={buttonStyle}
                hoverColor="transparent"
                onClick={this.openGethDialog}
              />
              {this.renderGethDialog()}
            </div>
          }
          {this.props.ipfsStatus &&
            <div style={this.getContainerStyle(this.getIpfsState())}>
              <FlatButton
                icon={ipfsIcon}
                style={buttonStyle}
                hoverColor="transparent"
                onClick={this.openIpfsDialog}
              />
              {this.renderIpfsDialog()}
            </div>
          }
        </div>;
    }
}

ServiceStatusBar.propTypes = {
    gethStatus: PropTypes.shape().isRequired,
    gethLogs: PropTypes.shape().isRequired,
    ipfsStatus: PropTypes.shape().isRequired,
    ipfsErrors: PropTypes.shape().isRequired,
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
}

function mapStateToProps (state, ownProps) {
    return {
        gethStatus: state.externalProcState.get('gethStatus'),
        gethLogs: state.externalProcState.get('gethLogs'),
        ipfsStatus: state.externalProcState.get('ipfsStatus'),
        ipfsErrors: state.externalProcState.get('ipfsErrors'),
        gethSettings: state.settingsState.get('geth'),
        ipfsSettings: state.settingsState.get('ipfs'),
        syncActionId: state.externalProcState.get('syncActionId'),
        gethBusyState: state.externalProcState.get('gethBusyState'),
        ipfsBusyState: state.externalProcState.get('ipfsBusyState'),
        timestamp: state.appState.get('timestamp')
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
