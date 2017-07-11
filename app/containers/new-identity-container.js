import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { setupMessages } from '../locale-data/messages';
import { profileCreateEthAddress } from '../local-flux/actions/profile-actions';
import { showTerms } from '../local-flux/actions/app-actions';
import { selectLoggedAccount, selectProfileFlag } from '../local-flux/selectors';
import { NewIdentityForm } from '../components';
import setupStyles from '../components/setup/setup.scss';

class NewIdentity extends Component {
    componentWillReceiveProps (nextProps) {
        const { loggedAccount, history } = this.props;
        if (!loggedAccount && nextProps.loggedAccount) {
            history.push('/dashboard/');
        }
    }

    render () {
        const { ethAddressPending, history, intl, loginPending } = this.props;
        const buttonsDisabled = loginPending || ethAddressPending;
        return (
          <div className={`full-page ${setupStyles.fullColumn}`}>
            <div style={{ width: '60%', margin: '40px auto 0', maxWidth: '800px' }}>
              <div style={{ fontSize: '22px', fontWeight: '600' }}>
                {intl.formatMessage(setupMessages.createIdentity)}
              </div>
              <NewIdentityForm
                buttonsDisabled={buttonsDisabled}
                onCancel={history.goBack}
                onSubmit={this.props.profileCreateEthAddress}
                showTerms={this.props.showTerms}
              />
            </div>
          </div>
        );
    }
}

NewIdentity.propTypes = {
    ethAddressPending: PropTypes.bool,
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    loggedAccount: PropTypes.string,
    loginPending: PropTypes.bool,
    profileCreateEthAddress: PropTypes.func.isRequired,
    showTerms: PropTypes.func.isRequired
};

function mapStateToProps (state) {
    return {
        ethAddressPending: selectProfileFlag(state, 'ethAddressPending'),
        loggedAccount: selectLoggedAccount(state),
        loginPending: selectProfileFlag(state, 'loginPending'),        
    };
}

export default connect(
    mapStateToProps,
    {
        profileCreateEthAddress,
        showTerms
    }
)(injectIntl(NewIdentity));
