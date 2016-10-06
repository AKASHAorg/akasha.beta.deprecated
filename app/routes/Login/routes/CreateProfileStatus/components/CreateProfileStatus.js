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
        const { profileActions, transactionActions } = this.props;
        const {
            tempProfile,
            minedTransactions,
            loggedProfile,
            pendingTransactions,
            errors } = nextProps;
        const profileCreationStatus = tempProfile.get('currentStatus');
        const { success, faucetTx, publishTx } = profileCreationStatus;
        const publishMined = this._checkTxMined(minedTransactions, publishTx);
        const faucetMined = this._checkTxMined(minedTransactions, faucetTx);

        if (errors.size === 0 && tempProfile.get('username')) {
            console.log('resuming step', profileCreationStatus);
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
        const {
            currentStep,
            success,
            faucetTx,
            publishTx,
            faucetRequested,
            publishRequested } = profileCreationStatus;
        const faucetMined = this._checkTxMined(minedTransactions, faucetTx);
        const publishMined = this._checkTxMined(minedTransactions, publishTx);
        const isLoggedIn = loggedProfile.get('account') &&
            tempProfile.get('address') === loggedProfile.get('account') &&
            (Date.parse(loggedProfile.get('expiration')) > Date.now());
        const shouldListenFaucetTx = !faucetMined && faucetRequested && faucetTx;
        const shouldListenPublishTx = !publishMined && publishRequested && publishTx;
        switch(currentStep) {
            case 0:
                if (success && !tempProfile.get('address')) {
                    // temp profile already created!
                    profileActions.createEthAddress(tempProfile.get('password'));
                    break;
                }
            case 1:
                if (!faucetRequested && tempProfile.get('address')) {
                    profileActions.requestFundFromFaucet(tempProfile.get('address'));
                    profileActions.updateTempProfile(tempProfile.toJS());
                }
            case 2:
                if (success) {
                    if (isLoggedIn) {
                        profileActions.publishProfile(loggedProfile.get('token'), tempProfile);
                        break;
                    }
                    profileActions.login({
                        account: tempProfile.get('address'),
                        password: tempProfile.get('password'),
                        rememberTime: 1 // does not matter here
                    });
                    break;
                }
                if (shouldListenFaucetTx) {
                    // listen for faucet transactions here!!
                    transactionActions.listenForMinedTx();
                    transactionActions.addToQueue([faucetTx]);
                    console.log(tempProfile.toJS(), 'tempProfile')
                    profileActions.updateTempProfile(tempProfile.toJS());
                    break;
                }
            case 3:
                if (success) {
                    this.context.router.push('/authenticate/new-profile-complete');
                    break;
                }
                if (shouldListenPublishTx) {
                    transactionActions.listenForMinedTx();
                    profileActions.addTxToQueue(profileCreationStatus.get('publishTx').toJS(), 'publish');
                    profileActions.updateTempProfile(tempProfile.toJS());
                    break;
                }
            default:
                break;
        }
        // if (currentStep === 0) {
        //     if (success && !tempProfile.get('address')) {
        //         // temp profile already created!
        //         profileActions.createEthAddress(tempProfile.get('password'));
        //     } else {
        //         profileActions.updateTempProfile(tempProfile.toJS());
        //     }
        // } else if (currentStep === 1) {
        //     // temp profile created
        //     // eth address created
        //     if (!faucetRequested && tempProfile.get('address')) {
        //         profileActions.requestFundFromFaucet(tempProfile.get('address').toJS());
        //     }
        // } else if (currentStep === 2) {
        //     /** temp profile created
        //      * eth address created
        //      * faucet requested and transaction mined
        //      * node_modules\.bin\_mocha tests\index.js
        //      **/
        //     if (success) {
        //         if (isLoggedIn) {
        //             console.log('PUBLIIIIIISH!!!!!!!!!!!!!!!!!!')
        //             return profileActions.publishProfile(loggedProfile.get('token'), tempProfile);
        //         }
        //         return profileActions.login({
        //             account: tempProfile.get('address'),
        //             password: tempProfile.get('password'),
        //             rememberTime: 1 // does not matter here
        //         });
        //     }
        //     console.log(shouldListenFaucetTx, 'shouldListenFaucetTx!!!');
        //     if (shouldListenFaucetTx) {
        //         // listen for faucet transactions here!!
        //         transactionActions.listenForMinedTx();
        //         transactionActions.addToQueue([faucetTx]);
        //         console.log(tempProfile.toJS(), 'tempProfile')
        //         return profileActions.updateTempProfile(tempProfile.toJS());
        //     }
        // } else if (currentStep === 3) {
        //     if (success) {
        //         return this.context.router.push('/authenticate/new-profile-complete');
        //     }
        //     if (shouldListenPublishTx) {
        //         transactionActions.listenForMinedTx();
        //         profileActions.addTxToQueue(profileCreationStatus.get('publishTx').toJS(), 'publish');
        //         return profileActions.updateTempProfile(tempProfile.toJS());
        //     }
        // }
    }
    render () {
        const { style, tempProfile } = this.props;
        const paraStyle = { marginTop: '20px' };
        const currentStep = tempProfile.get('currentStatus').currentStep;
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
