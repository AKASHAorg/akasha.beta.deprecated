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
    componentDidMount () {
        const { profileActions, tempProfile } = this.props;
        if (tempProfile && tempProfile.get('username')) {
            profileActions.resumeProfileCreation();
        }
    }
    componentDidUpdate () {
        const { profileActions, transactionActions } = this.props;
        const {
            tempProfile,
            minedTransactions,
            errors } = this.props;
        const profileCreationStatus = tempProfile.get('currentStatus');
        const { faucetTx, publishTx, currentStep, faucetRequested, publishRequested } = profileCreationStatus;
        const publishMined = this._checkTxIndex(minedTransactions, publishTx);
        const faucetMined = this._checkTxIndex(minedTransactions, faucetTx);
        const shouldListenFaucetTx = errors.size === 0 &&
            currentStep === 'REQUEST_FUND_FROM_FAUCET_SUCCESS' && !faucetMined && !faucetRequested;
        const shouldListenPublishTx = errors.size === 0 &&
            currentStep === 'COMPLETE_PROFILE_CREATION_SUCCESS' && !publishMined && !publishRequested;

        if (shouldListenFaucetTx) {
            transactionActions.listenForMinedTx();
            transactionActions.addToQueue([faucetTx]);
            profileActions.listenFaucetTx();
            return;
        }
        if (shouldListenPublishTx) {
            transactionActions.listenForMinedTx();
            transactionActions.addToQueue([publishTx]);
            profileActions.listenPublishTx();
            return;
        }
        if (currentStep === 'COMPLETE_PROFILE_CREATION_SUCCESS' && publishMined) {
            const hasEvents = minedTransactions.getIn([publishMined, 'hasEvents']);
            if (hasEvents) {
                console.log('Please check transaction events first!!!!');
            }
            this.context.router.push('/authenticate/new-profile-complete');
        }
        if (errors.size === 0 && tempProfile.get('username')) {
            profileActions.resumeProfileCreation();
        }
    }
    _checkTxIndex = (minedTransactions, transaction) =>
        minedTransactions.findIndex(trans => trans.tx === transaction) > -1;
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
