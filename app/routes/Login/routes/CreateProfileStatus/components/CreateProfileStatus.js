import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { RaisedButton } from 'material-ui';
import ErrorIcon from 'material-ui/svg-icons/alert/error';
import { injectIntl, FormattedMessage } from 'react-intl';
import { PanelContainer, PanelHeader } from 'shared-components';
import { generalMessages, setupMessages, profileMessages } from 'locale-data/messages';

class CreateProfileStatus extends Component {
    constructor (props) {
        super(props);
        this.isServiceRestarted = false;
        this.state = {
            errors: []
        };
    }
    componentWillMount () {
        const { tempProfileActions, transactionActions, tempProfile } = this.props;
        if (tempProfile.get('akashaId') === '') {
            tempProfileActions.getTempProfile();
        }
        transactionActions.getMinedTransactions();
        transactionActions.getPendingTransactions();
    }
    componentWillReceiveProps (nextProps) {
        const { transactionActions } = nextProps;
        if (nextProps.tempProfile.get('akashaId') === '') {
            return this.context.router.push('/authenticate');
        }

        if (nextProps.profileErrors.size > 0 || nextProps.tempProfileErrors.size > 0) {
            return this.setState({
                errors: [...nextProps.profileErrors, ...nextProps.tempProfileErrors]
            });
        }
        if (!fetchingTransactions && pendingTransactions.size > 0) {
            const firstPendingTx = pendingTransactions.toJS()[0].tx;
            const isMined = minedTransactions.find(mined => mined.tx === firstPendingTx);
            if (isMined) {
                transactionActions.deletePendingTx(firstPendingTx);
            }
        }
        if ((nextProps.gethStatus.get('api') && !this.props.gethStatus.get('api'))
                || (nextProps.ipfsStatus.get('started') && !this.props.ipfsStatus.get('started'))
                || (nextProps.ipfsStatus.get('process') && !this.props.ipfsStatus.get('process'))) {
            this.isServiceRestarted = true;
        }
        // make sure tempProfile loaded from DB;
        if (nextProps.tempProfile && nextProps.tempProfile.get('akashaId') !== '') {
            return this.resumeProfileCreation(nextProps);
        }
        return null;
    }

    getCurrentStatusDescription = () => {
        const { tempProfile, loginRequested } = this.props;
        const currentStatus = this.props.tempProfile.get('currentStatus');
        const nextAction = currentStatus.get('nextAction');
        let description = <div />;

        switch (nextAction) {
            case 'createEthAddress':
                description = (
                  <FormattedMessage
                    id="app.createProfileStatus.createEthAddress"
                    description="Message status when generating eth key"
                    defaultMessage="Creating local Ethereum key"
                  />
                );
                break;
            case 'requestFundFromFaucet':
                description = (
                  <FormattedMessage
                    id="app.createProfileStatus.requestingEthers"
                    description="Message status when request to faucet started"
                    defaultMessage="Receiving aethers from AKASHA"
                  />
                );
                break;
            case 'listenFaucetTx':
                if (loginRequested) {
                    description = (
                      <FormattedMessage
                        id="app.createProfileStatus.loggingIn"
                        description="Message status when we are sending login request"
                        defaultMessage={'Logging in with {akashaId}'}
                        values={{ akashaId: <b>@{tempProfile.get('akashaId')}</b> }}
                      />
                    );
                } else if (currentStatus.get('publishRequested')) {
                    description = (
                      <FormattedMessage
                        id="app.createProfileStatus.publishing"
                        description="Message status when we are sending publish request"
                        defaultMessage="Publishing your profile"
                      />
                    );
                } else {
                    description = (
                      <FormattedMessage
                        id="app.createProfileStatus.waitingFaucetTransactionMined"
                        description="Message status when waiting for faucet transaction to be mined"
                        defaultMessage={`Waiting for faucet transaction to be mined.
                            Transaction id: {faucetTx}`}
                        values={{ faucetTx: <small>{currentStatus.get('faucetTx')}</small> }}
                      />
                    );
                }
                break;
            case 'listenPublishTx':
                description = (
                  <FormattedMessage
                    id="app.createProfileStatus.waitingPublishTransactionMined"
                    description="Message status when waiting for publish transaction to be mined"
                    defaultMessage={`Waiting for publish transaction to be mined.
                        Transaction id: {publishTx}`}
                    values={{ publishTx: <small>{currentStatus.get('publishTx')}</small> }}
                  />
                );
                break;
            default:
                description = (
                  <FormattedMessage
                    id="app.createProfileStatus.registering"
                    description="Message status when registering"
                    defaultMessage={`Registering process derailed to an unknown step.
                        Please abort current registration and try again.`}
                  />
                );
                break;
        }
        return description;
    };
    addTxToQueue = (tx, type) => {
        const { transactionActions } = this.props;
        transactionActions.listenForMinedTx();
        transactionActions.addToQueue([{ tx, type }]);
    };
    finishProfilePublishing = () =>
        this.context.router.push('/authenticate/new-profile-complete');

    _checkTxIndex = (transactions, transaction) =>
        transactions.findIndex(trans => trans.tx === transaction);

    // resuming profile creation steps
    // this method is called on componentWillReceiveProps
    // @param props <Object> nextProps
    resumeProfileCreation (props) {
        const {
            tempProfileActions,
            tempProfile,
            loggedProfile,
            minedTransactions,
            pendingTransactions,
            tempProfileErrors,
            profileErrors,
            loginRequested } = props;

        const {
            faucetTx,
            publishTx,
            listeningPublishTx,
            listeningFaucetTx,
            nextAction } = tempProfile.get('currentStatus');
        const publishMinedIndex = this._checkTxIndex(minedTransactions, publishTx);
        const faucetMinedIndex = this._checkTxIndex(minedTransactions, faucetTx);
        const publishPendingIndex = this._checkTxIndex(pendingTransactions, publishTx);
        const faucetPendingIndex = this._checkTxIndex(pendingTransactions, faucetTx);
        const shouldListenFaucetTx = nextAction === 'listenFaucetTx' && faucetPendingIndex === -1 &&
            faucetMinedIndex === -1 && !listeningFaucetTx;
        const shouldListenPublishTx = nextAction === 'listenPublishTx' &&
            publishPendingIndex === -1 && publishMinedIndex === -1 && !listeningPublishTx;

        if (shouldListenPublishTx) {
            tempProfileActions.listenPublishTx();
            return this.addTxToQueue(publishTx, 'registerProfile');
        }

        if (shouldListenFaucetTx) {
            tempProfileActions.listenFaucetTx();
            return this.addTxToQueue(faucetTx, 'faucet');
        }

        if (nextAction === 'listenFaucetTx' && faucetMinedIndex > -1) {
            return tempProfileActions.publishProfile(tempProfile, loggedProfile, loginRequested);
        }

        if (nextAction === 'listenPublishTx' && publishMinedIndex > -1) {
            return this.finishProfilePublishing(minedTransactions, publishMinedIndex);
        }

        if (tempProfileErrors.size === 0 && tempProfile.get('akashaId') &&
            profileErrors.size === 0) {
            tempProfileActions[nextAction](tempProfile);
        }
        return null;
    }
    _handleProfileAbortion = () => {
        const { tempProfileActions, tempProfile } = this.props;
        tempProfileActions.deleteTempProfile(tempProfile.get('akashaId'));
        tempProfileActions.clearErrors();
    }
    _handleStepRetry = () => {
        const { profileActions, tempProfile, tempProfileActions } = this.props;
        const { nextAction } = tempProfile.currentStatus;
        this.isGethRestarted = false;
        profileActions.clearErrors();
        tempProfileActions.clearErrors();
        if (nextAction === 'listenFaucetTx') {
            const currentStatus = tempProfile.get('currentStatus')
                .merge({ listeningFaucetTx: false });
            tempProfileActions.updateTempProfile({}, currentStatus.toJS());
        } else if (nextAction === 'listenPublishTx') {
            const currentStatus = tempProfile.get('currentStatus')
                .merge({ listeningPublishTx: false });
            tempProfileActions.updateTempProfile({}, currentStatus.toJS());
        }
        this.resumeProfileCreation(this.props);
    }
    renderWarningMessage () {
        const { intl } = this.props;
        const { palette } = this.context.muiTheme;

        return (
          <div
            style={{ height: '36px', lineHeight: '36px', display: 'flex', alignItems: 'center' }}
          >
            <ErrorIcon style={{ color: palette.accent1Color }} />
            <span style={{ marginLeft: '5px', color: palette.accent1Color }}>
              {intl.formatMessage(generalMessages.serviceStoppedWarning)}
            </span>
          </div>
        );
    }
    render () {
        const { style, tempProfile, intl, gethStatus, ipfsStatus } = this.props;
        const { palette } = this.context.muiTheme;
        const { nextAction } = tempProfile.get('currentStatus');
        const paraStyle = { marginTop: '20px' };
        const errors = this.state.errors;
        const isServiceStopped = !gethStatus.get('api')
            || (!ipfsStatus.get('started') && !ipfsStatus.get('process'));
        return (
          <div style={style} >
            <PanelContainer
              showBorder
              header={
                <PanelHeader
                  title={intl.formatMessage(profileMessages.registeringIdentity)}
                  disableStopService
                />
              }
              actions={[
                  /* eslint-disable */
                  <RaisedButton
                    key="abort-register"
                    label={intl.formatMessage(generalMessages.abort)}
                    onClick={this._handleProfileAbortion}
                    disabled={(nextAction === 'listenPublishTx')}
                    style={{ marginRight: 8 }}
                  />,
                  <RaisedButton
                    key="retry-step"
                    label={intl.formatMessage(setupMessages.retryStep)}
                    onClick={this._handleStepRetry}
                    primary
                    disabled={((errors.size === 0 || errors.length === 0)
                        && !this.isServiceRestarted) || isServiceStopped}
                  />
                  /* eslint-enable */
              ]}
              leftActions={isServiceStopped && this.renderWarningMessage()}
            >
              <div className="col-xs">
                <p style={paraStyle}>
                  <FormattedMessage
                    id="app.createProfile.yourIdentityIsBroadcasted"
                    description="describing that identity is broadcasted into network"
                    defaultMessage="Your identity is broadcasted into the AKASHA private network."
                  />
                </p>
                <p style={paraStyle}>
                  <FormattedMessage
                    id="app.createProfile.willTakeFewMinutes"
                    description="action `will take a few moments` to complete"
                    defaultMessage="This will take a few moments"
                  /> ...
                </p>
                <div>
                  <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
                    <h4>
                      <FormattedMessage
                        id="app.createProfileStatus.currentStatus"
                        description="text title"
                        defaultMessage="Current Status"
                      />:
                    </h4>
                  </div>
                  <div
                    style={{
                        marginTop: '20px',
                        marginLeft: '16px',
                        display: 'inline-block',
                        verticalAlign: 'middle'
                    }}
                  >
                    {this.getCurrentStatusDescription()}
                  </div>
                </div>
                <div style={{ marginTop: '20px', color: palette.accent1Color }}>
                  {this.state.errors.map((err, key) =>
                    (<div className="error-card" key={key}>
                      <p>{err.code}</p>
                      <p>{err.message}</p>
                    </div>)
                  )}
                </div>
              </div>
            </PanelContainer>
          </div>
        );
    }
}

CreateProfileStatus.propTypes = {
    profileActions: PropTypes.shape().isRequired,
    tempProfileActions: PropTypes.shape().isRequired,
    tempProfile: PropTypes.shape(),
    style: PropTypes.shape(),
    intl: PropTypes.shape(),
    transactionActions: PropTypes.shape(),
    gethStatus: PropTypes.shape().isRequired,
    ipfsStatus: PropTypes.shape().isRequired,
    loginRequested: PropTypes.bool,
    loggedProfile: PropTypes.shape()
};

CreateProfileStatus.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};

CreateProfileStatus.defaultProps = {
    style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    }
};

export default injectIntl(CreateProfileStatus);
