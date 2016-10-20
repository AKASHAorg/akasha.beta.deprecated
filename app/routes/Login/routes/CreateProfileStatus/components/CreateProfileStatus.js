import React, { Component, PropTypes } from 'react';
import { MenuAkashaLogo } from 'shared-components/svg';
import * as Colors from 'material-ui/styles/colors';
import { SvgIcon, RaisedButton } from 'material-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { PanelContainer } from 'shared-components';
import { generalMessages, setupMessages } from 'locale-data/messages';
import { is } from 'immutable';
class CreateProfileStatus extends Component {
    constructor (props) {
        super(props);
        this.state = {
            errors: []
        };
    }
    componentWillMount () {
        const { profileActions, transactionActions } = this.props;
        profileActions.getTempProfile();
        transactionActions.getMinedTransactions();
        transactionActions.getPendingTransactions();
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.tempProfile.get('username') === '') {
            return this.context.router.push('/authenticate');
        }
        if (nextProps.errors.size > 0) {
            return this.setState({
                errors: nextProps.errors
            });
        }
        const shouldResume =
            !is(nextProps.tempProfile.get('currentStatus'), this.props.tempProfile.get('currentStatus')) ||
            !is(nextProps.minedTransactions, this.props.minedTransactions) ||
            !is(nextProps.pendingTransactions, this.props.pendingTransactions) ||
            !is(nextProps.loggedProfile, this.props.loggedProfile) ||
            this.props.loginRequested !== nextProps.loginRequested;
        if (shouldResume) {
            return this.resumeProfileCreation(nextProps);
        }
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
                    defaultMessage="Creating local ethereum key"
                  />
                );
                break;
            case 'requestFundFromFaucet':
                description = (
                  <FormattedMessage
                    id="app.createProfileStatus.requestingEthers"
                    description="Message status when request to faucet started"
                    defaultMessage="Receiving ethers from AKASHA"
                  />
                );
                break;
            case 'listenFaucetTx':
                if (loginRequested) {
                    description = (
                      <FormattedMessage
                        id="app.createProfileStatus.loggingIn"
                        description="Message status when we are sending login request"
                        defaultMessage={`Logging in with {username}`}
                        values={{ username: <b>@{tempProfile.get('username')}</b> }}
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
                        values={{ faucetTx: currentStatus.get('faucetTx') }}
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
                    values={{ publishTx: currentStatus.get('publishTx') }}
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
    }
    addTxToQueue = (tx) => {
        const { transactionActions } = this.props;
        transactionActions.listenForMinedTx();
        transactionActions.addToQueue([tx]);
    }
    finishProfilePublishing = (minedTransactions, publishMinedIndex) => {
        const hasEvents = minedTransactions.getIn([publishMinedIndex, 'hasEvents']);
        if (!hasEvents) {
            console.error('No events!! Create a handler for this case!!');
        }
        return this.context.router.push('/authenticate/new-profile-complete');
    }
    _checkTxIndex = (transactions, transaction) =>
        transactions.findIndex(trans => trans.tx === transaction);

    // resuming profile creation steps
    // this method is called on componentWillReceiveProps
    // @param props <Object> nextProps
    resumeProfileCreation (props) {
        const {
            profileActions,
            tempProfile,
            loggedProfile,
            minedTransactions,
            pendingTransactions,
            errors,
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
            profileActions.listenPublishTx();
            return this.addTxToQueue(publishTx);
        }

        if (shouldListenFaucetTx) {
            profileActions.listenFaucetTx();
            return this.addTxToQueue(faucetTx);
        }

        if (nextAction === 'listenFaucetTx' && faucetMinedIndex > -1) {
            return profileActions.publishProfile(tempProfile, loggedProfile, loginRequested);
        }

        if (nextAction === 'listenPublishTx' && publishMinedIndex > -1) {
            return this.finishProfilePublishing(minedTransactions, publishMinedIndex);
        }

        if (errors.size === 0 && tempProfile.get('username')) {
            profileActions[nextAction](tempProfile);
        }
        return null;
    }
    _handleProfileAbortion = () => {
        const { profileActions, tempProfile } = this.props;
        profileActions.deleteTempProfile(tempProfile.get('username'));
        profileActions.clearErrors();
    }
    _handleStepRetry = () => {
        const { profileActions } = this.props;
        profileActions.clearErrors();
        this.resumeProfileCreation(this.props);
    }
    render () {
        const { style, tempProfile, intl } = this.props;
        const { nextAction } = tempProfile.get('currentStatus');
        const paraStyle = { marginTop: '20px' };
        const errors = this.state.errors;
        return (
          <div style={style} >
            <PanelContainer
              showBorder
              header={
                <div>
                  <SvgIcon
                    color={Colors.lightBlack}
                    viewBox="0 0 32 32"
                    style={{
                        width: '32px',
                        height: '32px',
                        marginRight: '10px',
                        verticalAlign: 'middle'
                    }}
                  >
                    <MenuAkashaLogo />
                  </SvgIcon>
                  <h1 style={{ fontWeight: '400', display: 'inline', verticalAlign: 'middle' }} >
                    <FormattedMessage
                      id="app.createProfile.registeringIdentity"
                      description="Registering identity status"
                      defaultMessage="Registering identity"
                    /> ...
                  </h1>
                </div>
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
                    disabled={(errors.size === 0 || errors.length === 0)}
                  />
                  /* eslint-enable */
              ]}
            >
              <div className="col-xs">
                <p style={paraStyle}>
                  <FormattedMessage
                    id="app.createProfile.yourIdentityIsBroadcasted"
                    description="describing that identity is broadcasted into network"
                    defaultMessage="Your identity is broadcasted into the Ethereum world computer network."
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
                <div style={{ marginTop: '20px', color: Colors.red300 }}>
                  {this.state.errors.map((err, key) =>
                    <div className="error-card" key={key}>
                      <p>{err.code}</p>
                      <p>{err.message}</p>
                    </div>
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
    tempProfile: PropTypes.shape(),
    style: PropTypes.shape(),
    intl: PropTypes.shape(),
    transactionActions: PropTypes.shape(),
};

CreateProfileStatus.contextTypes = {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
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
