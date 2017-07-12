import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { selectLoggedProfileData } from '../../local-flux/selectors';
import { PanelContainer, ProfilePanelsHeader, Panels, CommonTopBar, DashboardTopBar } from '../';
import { profileLogout } from '../../local-flux/actions/profile-actions';
import styles from './top-bar.scss';

class TopBar extends PureComponent {
    constructor (props) {
        super(props);
        this.state = {
            panelContentVisible: this._checkIsPanel()
        };
    }
    componentWillReceiveProps (nextProps) {
        const { history, loggedProfile } = nextProps;
        const oldLoggedProfile = this.props.loggedProfile;
        // the condition below is equivalent to a successful logout action
        if (!loggedProfile.get('account') && oldLoggedProfile.get('account')) {
            history.push('/setup/authenticate');
        }
    }
    _checkIsPanel = () => {
        const { location } = this.props;
        return location.pathname.includes('/panel/');
    }
    _getRootPath = (rootPath) => {
        const path = rootPath.split('/');
        return path.slice(0, path.length - 2).join('/');
    }
    _closePanel = () => {
        const { history, location } = this.props;
        const rootPath = this._getRootPath(location.pathname);
        return history.push(`${rootPath}${location.search}`);
    }
    _handleLogout = (ev) => {
        if (ev) ev.preventDefault();
        this.props.profileLogout();
    }
    _handlePanelVisible = (ev) => {
        ev.stopPropagation();
        if (ev.target && ev.target.id === 'panelWrapper') {
            this.setState({
                panelContentVisible: !this.state.panelContentVisible
            });
        }
    }
    _handleNotificationOpen = () => {
        console.log('open notification panel!');
    }
    _navigateToPanel = (panelName) => {
        const { history, location } = this.props;
        return (ev) => {
            if (!location.pathname.includes('/panel/')) {
                history.push(`${location.pathname}/panel/${panelName}${location.search}`);
            } else if (location.pathname.includes('/panel/') && !location.pathname.includes(panelName)) {
                history.push(`${this._getRootPath(location.pathname)}/panel/${panelName}${location.search}`);
            } else if (location.pathname.includes(panelName)) {
                history.push(`${this._getRootPath(location.pathname)}${location.search}`);
            }
            if (ev) ev.preventDefault();
        };
    }
    _renderComponent = (Component, injectedProps) =>
        props => <Component {...injectedProps} {...props} />;

    render () {
        const { fullEntryPage, loggedProfileData, location, match } = this.props;
        const { muiTheme } = this.context;
        return (
          <div
            className={`${styles.root} ${fullEntryPage ? styles.full : styles.normal} flex-center-y`}
            style={{ backgroundColor: muiTheme.palette.topBarBackgroundColor }}
          >
            <div className={styles.inner}>
              <Route
                path="/dashboard/:dashboardName?"
                render={this._renderComponent(DashboardTopBar, {
                    onPanelNavigate: this._navigateToPanel,
                    onNotificationPanelOpen: this._handleNotificationOpen
                })}
              />
              <Route
                path="/@:akashaId/:entryId(\d+)"
                render={this._renderComponent(CommonTopBar, {
                    onPanelNavigate: this._navigateToPanel,
                    onNotificationPanelOpen: this._handleNotificationOpen
                })}
              />
              <div
                id="panelWrapper"
                className={`${styles.panelWrapper} ${this._checkIsPanel() && styles.open}`}
                style={{ paddingRight: 0 }}
              >
                <ProfilePanelsHeader
                  onPanelNavigate={this._navigateToPanel}
                  onLogout={this._handleLogout}
                  firstName={loggedProfileData.get('firstName')}
                  lastName={loggedProfileData.get('lastName')}
                />
                <PanelContainer
                  maxWidth="100%"
                  width="100%"
                  style={{ height: 'calc(100% - 48px)', background: '#EBEBEB' }}
                >
                  <Panels location={location} match={match} onPanelNavigate={this._navigateToPanel} />
                </PanelContainer>
              </div>
            </div>
            <div
              className={`${styles.panelWrapperOverlay} ${this._checkIsPanel() && styles.overlayVisible}`}
              style={{ width: 'calc(100% - 64%)' }}
              onClick={this._closePanel}
            />
          </div>
        );
    }
}

TopBar.contextTypes = {
    muiTheme: PropTypes.shape()
};

TopBar.propTypes = {
    children: PropTypes.node,
    fullEntryPage: PropTypes.bool,
    history: PropTypes.shape(),
    location: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    match: PropTypes.shape(),
    profileLogout: PropTypes.func,
};
const mapStateToProps = state => ({
    loggedProfileData: selectLoggedProfileData(state),
    loggedProfile: state.profileState.get('loggedProfile')
});

export default connect(
    mapStateToProps,
    {
        profileLogout,
    }
)(TopBar);
