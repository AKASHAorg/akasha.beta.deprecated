import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { DashboardTopBar, NewEntryTopBar, TopBarRight } from '../';
import { toggleAethWallet, toggleEthWallet } from '../../local-flux/actions/app-actions';
import { selectBalance, selectEntryFlag, selectFullEntry, selectLoggedProfile,
    selectLoggedProfileData } from '../../local-flux/selectors';

class TopBar extends PureComponent {
    componentWillReceiveProps (nextProps) {
        const { history, loggedProfile } = nextProps;
        const oldEthAddress = this.props.loggedProfile.get('ethAddress');
        // the condition below is equivalent to a successful logout action
        if ((!loggedProfile.get('ethAddress') && oldEthAddress) || !oldEthAddress) {
            history.push('/setup/authenticate');
        }
    }

    _renderComponent = (Component, injectedProps) =>
        props => <Component {...injectedProps} {...props} />;

    render () {
        const { balance, fullEntry, showSecondarySidebar } = this.props;
        const className = classNames('flex-center-y top-bar', {
            'top-bar_full': !showSecondarySidebar || fullEntry,
            'top-bar_default': !fullEntry
        });
        return (
          <div className={className}>
            <div className="top-bar__left-side">
              <Route
                component={DashboardTopBar}
                path="/dashboard/:dashboardName?"
              />
              <Route
                path="/draft/:type/:draftId"
                render={this._renderComponent(NewEntryTopBar, {
                    onPanelNavigate: this._navigateToPanel,
                    onNotificationPanelOpen: this._handleNotificationOpen
                })}
              />
            </div>
            <TopBarRight
              balance={balance}
              toggleAethWallet={this.props.toggleAethWallet}
              toggleEthWallet={this.props.toggleEthWallet}
            />
          </div>
        );
    }
}

TopBar.propTypes = {
    balance: PropTypes.shape().isRequired,
    fullEntry: PropTypes.bool,
    history: PropTypes.shape(),
    location: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    showSecondarySidebar: PropTypes.bool,
    toggleAethWallet: PropTypes.func.isRequired,
    toggleEthWallet: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    balance: selectBalance(state),
    fullEntry: !!selectFullEntry(state) || !!selectEntryFlag(state, 'fetchingFullEntry'),
    loggedProfile: selectLoggedProfile(state),
    loggedProfileData: selectLoggedProfileData(state),
});

export default connect(
    mapStateToProps,
    {
        toggleAethWallet,
        toggleEthWallet
    },
    null,
    { pure: false }
)(withRouter(injectIntl(TopBar)));
