import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { Breadcrumbs, DashboardTopBar, NewEntryTopBar, PanelLink, Panels, TopBarRight } from '../';
import { toggleAethWallet, toggleEthWallet } from '../../local-flux/actions/app-actions';
import { selectBalance, selectEntryFlag, selectFullEntry, selectLoggedProfile,
    selectLoggedProfileData } from '../../local-flux/selectors';

class TopBar extends PureComponent {
    componentWillReceiveProps (nextProps) {
        const { history, loggedProfile } = nextProps;
        const oldLoggedProfileAccount = this.props.loggedProfile.get('ethAddress');
        // the condition below is equivalent to a successful logout action
        if ((!loggedProfile.get('ethAddress') && oldLoggedProfileAccount) || !oldLoggedProfileAccount) {
            history.push('/setup/authenticate');
        }
    }

    _checkIsPanel = () => {
        const { location } = this.props;
        return location.pathname.includes('/panel/');
    }

    _closePanel = () => {
        const { history, location } = this.props;
        const rootPath = location.pathname.split('/panel/')[0];
        return history.replace(`${rootPath}${location.search}`, { ...location.state });
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
          <div>
            <div className={className}>
              <div className="top-bar__inner">
                <div className="top-bar__content">
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
                    <Route
                      component={Breadcrumbs}
                      path="/@:akashaId/:entryId(\d+)"
                    />
                    <Route
                      component={Breadcrumbs}
                      path="/search/:topic/:query?"
                    />
                    <Route
                      component={Breadcrumbs}
                      exact
                      path="/@:akashaId"
                    />
                  </div>
                  <TopBarRight
                    balance={balance}
                    toggleAethWallet={this.props.toggleAethWallet}
                    toggleEthWallet={this.props.toggleEthWallet}
                  />
                </div>
                <div
                  id="panelWrapper"
                  className={
                      `top-bar__panel-wrapper
                      top-bar__panel-wrapper${this._checkIsPanel() ? '_open' : ''}`
                  }
                >
                  <Panels />
                </div>
              </div>
            </div>
            <div
              className={
                  `top-bar__panel-wrapper-overlay
                  top-bar__panel-wrapper-overlay${this._checkIsPanel() ? '_visible' : ''}`
              }
              style={{ width: 'calc(100% - 64%)' }}
            >
              <PanelLink to="">
                <div className="top-bar__panel-link-inner" />
              </PanelLink>
            </div>
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
