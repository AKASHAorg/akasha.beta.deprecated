import React, { Component, PropTypes } from 'react';
import { MenuAkashaLogo } from 'shared-components/svg';
import * as Colors from 'material-ui/styles/colors';
import { SvgIcon } from 'material-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { PanelContainer } from 'shared-components';

class CreateProfileStatus extends Component {
    componentWillMount () {
        const { profileActions, transactionActions } = this.props;
        profileActions.getTempProfile();
        transactionActions.getMinedTransactions();
        transactionActions.getPendingTransactions();
    }
    componentWillUpdate (nextProps) {
        const { tempProfile, minedTransactions, loggedProfile, pendingTransactions } = nextProps;
        const publishMined = minedTransactions.findIndex(transaction => transaction.tx === tempProfile.getIn(['currentStatus', 'publishTx'])) !== -1;
        if (!publishMined) {
            console.log('resumePublish');
            this.resumeProfileCreation(tempProfile, minedTransactions, pendingTransactions, loggedProfile);
        } else if (publishMined) {
            this.context.router.push('/authenticate/new-profile-complete');
        }
    }
    resumeProfileCreation (tempProfile, minedTransactions, pendingTransactions, loggedProfile) {
        const { profileActions, transactionActions } = this.props;
        const profileCreationStatus = tempProfile.get('currentStatus');
        console.log(profileCreationStatus, 'creation');
        const faucetTransactionIndex = minedTransactions.findIndex(transaction =>
            transaction.tx === profileCreationStatus.faucetTx
        );
        const publishTransactionIndex = minedTransactions.findIndex(transaction =>
            transaction.tx === profileCreationStatus.publishTx
        );
        const profileCreationStep = profileCreationStatus.currentStep;
        const currentStepSuccess = profileCreationStatus.success;
        console.log('resuming', profileCreationStep, profileCreationStatus);
        console.log('step2', currentStepSuccess, tempProfile.get('address'), faucetTransactionIndex);
        if (profileCreationStep === 1) {
            if (!currentStepSuccess) {
                profileActions.createEthAddress(tempProfile.get('password'));
            }
        } else if (profileCreationStep === 2 && !currentStepSuccess && tempProfile.get('address')) {
            if (!profileCreationStatus.faucetTx) {
                profileActions.requestFundFromFaucet(tempProfile.get('address'));
            } else if (faucetTransactionIndex === -1) {
                transactionActions.listenForMinedTx();
                transactionActions.addToQueue([{ tx: tempProfile.get('faucetTx') }]);
            }
        } else if (profileCreationStep === 3 && faucetTransactionIndex > -1 && profileCreationStatus.faucetTx) {
            if (!loggedProfile.get('account')) {
                console.log('logging in');
                return profileActions.login({
                    account: tempProfile.get('address'),
                    password: tempProfile.get('password'),
                    rememberTime: 1
                });
            }
            // we should have a logged profile!
            const tokenIsValid = (new Date(loggedProfile.get('expiration')) - Date.now()) > 0;
            // just to make sure we don`t have another profile logged in..
            const tempIsLogged = loggedProfile.get('account') === tempProfile.get('address');
            console.log(tempIsLogged, tokenIsValid, 'is valid!!')
            if (tempIsLogged && tokenIsValid) {
                return profileActions.publishProfile(loggedProfile.get('token'), tempProfile);
            }
        } else if (publishTransactionIndex === -1 && profileCreationStatus.publishTx) {
            transactionActions.listenForMinedTx();
            transactionActions.addToQueue([{ tx: tempProfile.get('publishTx') }]);
        }
        return null;
    }
    render () {
        const { style, tempProfile } = this.props;
        const paraStyle = { marginTop: '20px' };
        const currentStep = tempProfile.get('currentStatus').currentStep;
        console.log(currentStep, tempProfile, 'current, temp');
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
              >
                <div className="col-xs" >
                  <p style={paraStyle} >
                    <FormattedMessage
                      id="app.createProfile.yourIdentityIsBroadcasted"
                      description="describing that identity is broadcasted into network"
                      defaultMessage="Your identity is broadcasted into the Ethereum world computer network."
                    />
                  </p>
                  <p style={paraStyle} >
                    <FormattedMessage
                      id="app.createProfile.willTakeFewMinutes"
                      description="action `will take a few moments` to complete"
                      defaultMessage="This will take a few moments"
                    /> ...
                  </p>
                  <span style={{ marginTop: '20px', fontSize: '13px' }} >
                    {/** profileState.getIn(['create', 'steps']).map((step, key) => <p key={key}>{step}</p>)*/}
                  </span>
                  <p style={{ marginTop: '20px', color: Colors.red300 }} >
                      {/** profileState.getIn(['create', 'err']) */}
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
    style: PropTypes.object,
    intl: React.PropTypes.object
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
