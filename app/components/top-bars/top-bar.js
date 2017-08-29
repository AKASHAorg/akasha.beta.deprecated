import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { Breadcrumbs, DashboardTopBar, PanelLink, Panels, TopBarRightSide } from '../';
import { profileLogout } from '../../local-flux/actions/profile-actions';
import { selectBalance, selectEntryFlag, selectFullEntry, selectLoggedProfile,
    selectLoggedProfileData } from '../../local-flux/selectors';
import styles from './top-bar.scss';

class TopBar extends Component {
    componentWillReceiveProps (nextProps) {
        const { history, loggedProfile } = nextProps;
        const oldLoggedProfileAccount = this.props.loggedProfile.get('account');
        // the condition below is equivalent to a successful logout action
        if ((!loggedProfile.get('account') && oldLoggedProfileAccount) || !oldLoggedProfileAccount) {
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
        console.log('location state', location.state);
        return history.replace(`${rootPath}${location.search}`, { ...location.state });
    }

    render () {
        const { balance, fullEntryPage, loggedProfile, loggedProfileData } = this.props;
        const { muiTheme } = this.context;

        return (
          <div>
            <div
              className={`${styles.root} ${fullEntryPage ? styles.full : styles.normal} flex-center-y`}
              style={{ backgroundColor: muiTheme.palette.topBarBackgroundColor }}
            >
              <div className={styles.inner}>
                <div style={{ display: 'flex', height: '32px', fontSize: '16px' }}>
                  <div style={{ flex: '1 1 auto' }}>
                    <Route
                      component={DashboardTopBar}
                      path="/dashboard/:dashboardName?"
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
                  className={`${styles.panelWrapper} ${this._checkIsPanel() && styles.open}`}
                  style={{ paddingRight: 0 }}
                >
                  <Panels />
                </div>
              </div>
            </div>
            <div
              className={`${styles.panelWrapperOverlay} ${this._checkIsPanel() && styles.overlayVisible}`}
              style={{ width: 'calc(100% - 64%)' }}
            >
              <PanelLink to=""><div style={{ width: '100%', height: '100%' }} /></PanelLink>
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
    fullEntryPage: PropTypes.bool,
    history: PropTypes.shape(),
    location: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
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
        profileLogout,
    },
    null,
    { pure: false }
)(withRouter(injectIntl(TopBar)));
