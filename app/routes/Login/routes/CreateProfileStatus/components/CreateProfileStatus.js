import React, { Component, PropTypes } from 'react';
import { MenuAkashaLogo } from 'shared-components/svg';
import * as Colors from 'material-ui/styles/colors';
import { SvgIcon, RaisedButton } from 'material-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { PanelContainer } from 'shared-components';

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
        console.log(nextProps.tempProfile);
        if (!nextProps.tempProfile) {
            this.context.router.push('/authentication');
        }
        this.resumeProfileCreation(nextProps);
    }

    getCurrentStatusDescription = () => {
        const nextAction = this.props.tempProfile.getIn(['currentStatus', 'nextAction']);
        let description = <div />;

        switch (nextAction) {
            case 'createEthAddress':
                description = <div>Creating local ethereum key</div>;
                break;
            case 'requestFundFromFaucet':
                description = <div>Receiving ethers from AKASHA</div>;
                break;
            case 'listenFaucetTx':
                description = <div>Waiting for transaction to be mined</div>;
                break;
            case 'listenPublishTx':
                description = <div>Waiting for publish transaction to be mined</div>;
                break;
            default:
                description = <div>Registering...</div>;
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
        if (hasEvents) {
            console.log('Please check transaction events first!!!!');
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
            errors } = props;
        const { faucetTx, publishTx, nextAction } = tempProfile.get('currentStatus');
        const publishMinedIndex = this._checkTxIndex(minedTransactions, publishTx);
        const faucetMinedIndex = this._checkTxIndex(minedTransactions, faucetTx);
        const publishPendingIndex = this._checkTxIndex(pendingTransactions, publishTx);
        const faucetPendingIndex = this._checkTxIndex(pendingTransactions, faucetTx);
        const shouldListenFaucetTx = nextAction === 'listenFaucetTx' && faucetPendingIndex === -1 &&
            faucetMinedIndex === -1;
        const shouldListenPublishTx = nextAction === 'listenPublishTx' &&
            publishPendingIndex === -1 && publishMinedIndex === -1;
        if (errors.size > 0) {
            this.setState({
                errors
            });
        }
        if (shouldListenFaucetTx) {
            return this.addTxToQueue(faucetTx);
        } else if (nextAction === 'listenFaucetTx' && faucetMinedIndex > -1) {
            profileActions.publishProfile(tempProfile, loggedProfile);
        }

        if (shouldListenPublishTx) {
            return this.addTxToQueue(publishTx);
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
        const { profileActions } = this.props;
        profileActions.deleteTempProfile();
    }
    _handleStepRetry = () => {
        const profileActions = this.props;
        profileActions.clearErrors();
    }
    render () {
        const { style, tempProfile } = this.props;
        const { faucetTx, publishTx, nextAction } = tempProfile.get('currentStatus');
        const paraStyle = { marginTop: '20px' };
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
                  <RaisedButton
                    key="abort-register"
                    label="Abort"
                    onClick={this._handleProfileAbortion}
                    disabled={(nextAction === 'listenPublishTx' || nextAction === 'listenFaucetTx')}
                  />,
                  <RaisedButton
                    key="retry-step"
                    label="Retry Step"
                    onClick={this._handleStepRetry}
                    primary
                    disabled={this.state.errors.size === 0}
                  />
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
                    <h4>Current Status:</h4>
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
                <p style={{ marginTop: '20px', color: Colors.red300 }}>
                  {this.state.errors.map(err =>
                    <div className="error-card">
                      <p>{err.code}</p>
                      <p>{err.message}</p>
                    </div>
                  )}
                </p>
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
    minedTransactions: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    pendingTransactions: PropTypes.shape(),
    transactionActions: PropTypes.shape(),
    errors: PropTypes.shape()
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
