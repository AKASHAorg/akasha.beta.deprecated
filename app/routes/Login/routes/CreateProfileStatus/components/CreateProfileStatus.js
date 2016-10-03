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
        const publishMined = this._checkTxMined(minedTransactions, tempProfile.getIn(['currentStatus', 'publishTx']));
        const faucetMined = this._checkTxMined(minedTransactions, tempProfile.getIn(['currentStatus', 'faucetTx']));

        if (!publishMined) {
            console.log('resumePublish');
            this.resumeProfileCreation({
                tempProfile,
                minedTransactions,
                pendingTransactions,
                loggedProfile
            });
        }
    }
    _checkTxMined = (minedTransactions, transaction) =>
        minedTransactions.findIndex(trans => trans.tx === transaction) > -1;

    resumeProfileCreation = (params) => {
        const {
            tempProfile,
            minedTransactions,
            pendingTransactions,
            loggedProfile } = params;
        const { profileActions, transactionActions } = this.props;
        const profileCreationStatus = tempProfile.get('currentStatus');
        const { currentStep, success, faucetTx, publishTx } = profileCreationStatus;
        const faucetMined = this._checkTxMined(minedTransactions, faucetTx);
        const publishMined = this._checkTxMined(minedTransactions, publishTx);
        const isLoggedIn = loggedProfile.get('account') && tempProfile.get('address') === loggedProfile.get('account');
        // switch (currentStep) {
        //     case 0:
        //         if (!success) break;
        //         profileActions.createEthAddress(tempProfile.get('password'));
        //         break;
        //     case 1:
        //         if (!success) break;
        //     default:
        //         break;
        // }
        if (currentStep === 0 && success) {
            // temp profile already created!
            profileActions.createEthAddress(tempProfile.get('password'));
        } else if (currentStep === 1 && success && tempProfile.get('address')) {
            // temp profile created
            // eth address created
            profileActions.requestFundFromFaucet(tempProfile.get('address'));
        } else if (currentStep === 2 && success && faucetMined) {
            /** temp profile created
             * eth address created
             * faucet requested and transaction mined
             **/
            if (isLoggedIn) {
                profileActions.publishProfile(tempProfile);
            } else {
                // we need to obtain auth token first
                profileActions.login({
                    account: tempProfile.get('address'),
                    password: tempProfile.get('password'),
                    rememberTime: 1 // does not matter here
                });
            }
        } else if (currentStep === 3 && success && publishMined) {
            return console.log('publish!!!');
            this.context.router.push('/authenticate/new-profile-complete');
        }
    }
    render () {
        const { style, tempProfile } = this.props;
        const paraStyle = { marginTop: '20px' };
        console.log(tempProfile.get('currentStatus'), 'currentStatus');
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
