import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { Breadcrumbs, DashboardTopBar, PanelLink, Panels, TopBarRightSide, NewEntryTopBar } from '../';
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
        const { balance, fullEntry, loggedProfile, loggedProfileData, showSecondarySidebar } = this.props;
        const { muiTheme } = this.context;

        return (
          <div>
            <div
              className={
                  `top-bar
                  top-bar${showSecondarySidebar ? '' : '_full'}
                  top-bar${fullEntry ? '_full' : '_default'}
                  flex-center-y`
              }
              style={{ backgroundColor: muiTheme.palette.topBarBackgroundColor }}
            >
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
                  <TopBarRightSide
                    balance={balance}
                    canEditProfile={!!loggedProfile.get('akashaId')}
                    loggedProfileData={loggedProfileData}
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

TopBar.contextTypes = {
    muiTheme: PropTypes.shape()
};

TopBar.propTypes = {
    balance: PropTypes.string,
    fullEntry: PropTypes.bool,
    history: PropTypes.shape(),
    location: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    showSecondarySidebar: PropTypes.bool,
};

const mapStateToProps = state => ({
    balance: selectBalance(state),
    fullEntry: !!selectFullEntry(state) || !!selectEntryFlag(state, 'fetchingFullEntry'),
    loggedProfile: selectLoggedProfile(state),
    loggedProfileData: selectLoggedProfileData(state),
});

export default connect(
    mapStateToProps,
    {},
    null,
    { pure: false }
)(withRouter(injectIntl(TopBar)));
