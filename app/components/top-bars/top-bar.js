import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from 'react-router/withRouter';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { DashboardTopBar, Navigation, ProfilePageTopBar, TopBarRight } from '../';
import {
    showNotificationsPanel,
    showTransactionsLog,
    toggleAethWallet,
    toggleEthWallet
} from '../../local-flux/actions/app-actions';
import {
    actionSelectors,
    appSelectors,
    entrySelectors,
    profileSelectors,
    notificationSelectors
} from '../../local-flux/selectors';

class TopBar extends PureComponent {
    componentWillReceiveProps (nextProps) {
        const { history, loggedProfile } = nextProps;
        const oldEthAddress = this.props.loggedProfile.get('ethAddress');
        // the condition below is equivalent to a successful logout action
        if ((!loggedProfile.get('ethAddress') && oldEthAddress) || !oldEthAddress) {
            history.push('/setup/authenticate');
        }
    }

    _renderComponent = (Component, injectedProps) => props => <Component {...injectedProps} {...props} />;

    render () {
        const {
            balance,
            cyclingStates,
            fullEntry,
            hasPendingActions,
            notificationsLoaded,
            notificationsPanelOpen,
            showSecondarySidebar,
            showWallet,
            transactionsLogOpen,
            unreadNotifications
        } = this.props;
        const className = classNames('flex-center-y top-bar', {
            'top-bar_full': !showSecondarySidebar || fullEntry,
            'top-bar_default': !fullEntry
        });
        return (
            <div className={className}>
                <div className="top-bar__left-side">
                    <Switch>
                        <Route component={DashboardTopBar} path="/dashboard/:dashboardId?" />
                        <Route exact path="/0x:ethAddress" component={ProfilePageTopBar} />
                        <Route component={Navigation} />
                    </Switch>
                </div>
                <TopBarRight
                    balance={balance}
                    cyclingStates={cyclingStates}
                    hasPendingActions={hasPendingActions}
                    notificationsLoaded={notificationsLoaded}
                    notificationsPanelOpen={notificationsPanelOpen}
                    showNotificationsPanel={this.props.showNotificationsPanel}
                    showTransactionsLog={this.props.showTransactionsLog}
                    showWallet={showWallet}
                    toggleAethWallet={this.props.toggleAethWallet}
                    toggleEthWallet={this.props.toggleEthWallet}
                    transactionsLogOpen={transactionsLogOpen}
                    unreadNotifications={unreadNotifications}
                />
            </div>
        );
    }
}

TopBar.propTypes = {
    balance: PropTypes.shape().isRequired,
    cyclingStates: PropTypes.shape().isRequired,
    fullEntry: PropTypes.bool,
    hasPendingActions: PropTypes.bool,
    history: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    notificationsLoaded: PropTypes.bool,
    notificationsPanelOpen: PropTypes.bool,
    showNotificationsPanel: PropTypes.func.isRequired,
    showSecondarySidebar: PropTypes.bool,
    showTransactionsLog: PropTypes.func.isRequired,
    showWallet: PropTypes.string,
    toggleAethWallet: PropTypes.func.isRequired,
    toggleEthWallet: PropTypes.func.isRequired,
    transactionsLogOpen: PropTypes.bool,
    unreadNotifications: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
    balance: profileSelectors.selectBalance(state),
    cyclingStates: profileSelectors.selectCyclingStates(state),
    fullEntry:
        !!entrySelectors.selectFullEntry(state) ||
        !!entrySelectors.selectEntryFlag(state, 'fetchingFullEntry'),
    hasPendingActions: !!actionSelectors.selectPublishingActions(state).size,
    loggedProfile: profileSelectors.selectLoggedProfile(state),
    loggedProfileData: profileSelectors.getLoggedProfileData(state),
    notificationsLoaded: notificationSelectors.selectNotificationsLoaded(state),
    notificationsPanelOpen: appSelectors.selectNotificationsPanel(state),
    showWallet: appSelectors.selectShowWallet(state),
    transactionsLogOpen: appSelectors.selectTransactionsLog(state),
    unreadNotifications: notificationSelectors.selectUnreadNotifications(state)
});

export default connect(
    mapStateToProps,
    {
        showNotificationsPanel,
        showTransactionsLog,
        toggleAethWallet,
        toggleEthWallet
    },
    null,
    { pure: false }
)(withRouter(injectIntl(TopBar)));
