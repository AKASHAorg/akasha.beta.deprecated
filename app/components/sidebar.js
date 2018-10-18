import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import withRouter from 'react-router/withRouter';
import Link from 'react-router-dom/Link';
import { Button, Popover } from 'antd';
import { equals } from 'ramda';
import panels from '../constants/panels';
import { genId } from '../utils/dataModule';
import { Avatar, EssencePopover, Icon, KarmaPopover, ManaPopover, SidebarIcon } from './';
import { generalMessages } from '../locale-data/messages';
import { draftCreate, draftsGet } from '../local-flux/actions/draft-actions';
import { profileEditToggle } from '../local-flux/actions/app-actions';
import { profileLogout } from '../local-flux/actions/profile-actions';
import { selectLoggedProfileData, selectLoggedProfile,
    selectProfileEditToggle } from '../local-flux/selectors';
import { entryMessages } from '../locale-data/messages/entry-messages';

class Sidebar extends Component {
    state = {
        overlayVisible: false,
        showEntryMenu: false,
        visible: false
    };
    wasVisible = false;
    componentWillReceiveProps (nextProps) {
        const { loggedProfile, draftsFetched, fetchingDrafts } = nextProps;
        if (loggedProfile.get('ethAddress') && !draftsFetched && !fetchingDrafts) {
            this.props.draftsGet({
                ethAddress: loggedProfile.get('ethAddress')
            });
        }
    }
    shouldComponentUpdate (nextProps, nextState) {
        const props = this.props;
        return nextState.visible !== this.state.visible ||
            nextProps.activeDashboard !== props.activeDashboard ||
            !nextProps.drafts.equals(props.drafts) ||
            nextProps.draftsFetched !== props.draftsFetched ||
            nextProps.fetchingDrafts !== props.fetchingDrafts ||
            nextProps.isProfileEditToggled !== props.isProfileEditToggled ||
            !nextProps.loggedProfileData.equals(props.loggedProfileData) ||
            !nextProps.loggedProfile.equals(props.loggedProfile) ||
            equals(nextProps.location, props.location);
    }
    hide = () => {
        this.setState({
            visible: false,
        });
    }

    handleVisibleChange = (visible) => {
        this.wasVisible = true;
        this.setState({ visible });
    }

    handleSearch = () => this.handlePanelShow(panels.search);

    _isSidebarVisible = (location) => {
        /**
         * specify blacklisted routes
         *  on which we should not show sidebar
         */
        const blackList = ['setup'];
        return !blackList.every(route => location.pathname.includes(route));
    }
    _navigateTo = (path) => {
        const { history, userSelectedLicense, loggedProfile } = this.props;
        return () => {
            this.setState({
                showEntryMenu: false,
            }, () => {
                const draftId = genId();
                if (path === '/draft/article/new') {
                    this.props.draftCreate({
                        id: draftId,
                        ethAddress: loggedProfile.get('ethAddress'),
                        content: {
                            featuredImage: {},
                            licence: userSelectedLicense,
                            entryType: 'article',
                        },
                        tags: [],
                    });
                    return history.push(`/draft/article/${draftId}`);
                }
                if (path === '/draft/link/new') {
                    this.props.draftCreate({
                        id: draftId,
                        ethAddress: loggedProfile.get('ethAddress'),
                        content: {
                            featuredImage: {},
                            licence: userSelectedLicense,
                            entryType: 'link'
                        },
                        tags: [],
                    });
                    return history.push(`/draft/link/${draftId}`);
                }
                return history.push(path);
            });
        };
    }
    _checkActiveIcon = (name) => {
        const { location } = this.props;
        return location.pathname.includes(name);
    }

    _handleLogout = () => {
        if (this.props.isProfileEditToggled) {
            this.props.profileEditToggle();
        }
        this.props.profileLogout();
    }
    _handleMyDraftsClick = (ev) => {
        ev.preventDefault();
        const { drafts } = this.props;
        if (drafts.size > 0) {
            const draft = drafts.first();
            const draftId = draft.get('id');
            const draftType = draft.getIn(['content', 'entryType']);
            const navigate = this._navigateTo(`/draft/${draftType}/${draftId}`);
            return navigate();
        }
        const navigate = this._navigateTo('/draft/article/all');
        return navigate();
    }
    navigateToProfile = () => {
        const { history, loggedProfileData } = this.props;
        history.push(`/${loggedProfileData.ethAddress}`);
    };
    _getEntryMenu = () => {
        const { intl } = this.props;
        return (
          <div
            className="sidebar__entry-menu"
          >
            <ul className="sidebar__entry-menu-buttons">
              <li
                className="sidebar__entry-menu-buttons_wrapper"
              >
                <Button
                  type="entry-menu-button"
                  size="large"
                  className="borderless"
                  icon="file"
                  ghost
                  onClick={this._navigateTo('/draft/article/new')}
                />
                <div
                  className="sidebar__entry-menu-buttons_text"
                >
                  {intl.formatMessage(generalMessages.sidebarEntryTypeArticle)}
                </div>
              </li>
              <li
                className="sidebar__entry-menu-buttons_wrapper"
              >
                <Button
                  type="entry-menu-button"
                  size="large"
                  className="borderless"
                  icon="link"
                  ghost
                  onClick={this._navigateTo('/draft/link/new')}
                />
                <div
                  className="sidebar__entry-menu-buttons_text"
                >
                  {intl.formatMessage(generalMessages.sidebarEntryTypeLink)}
                </div>
              </li>
              <li
                className="sidebar__entry-menu-buttons_wrapper sidebar__entry-menu-buttons_wrapper-disabled"
              >
                <Button
                  type="entry-menu-button-disabled"
                  size="large"
                  className="borderless"
                  icon="picture"
                  ghost
                  disabled
                  onClick={() => {}}
                />
                <div
                  className="sidebar__entry-menu-buttons_text"
                >
                  {intl.formatMessage(generalMessages.sidebarEntryTypeImage)}
                </div>
              </li>
            </ul>
            <div>
              <div
                className="sidebar__entry-menu-buttons_draft-button"
                onClick={this._handleMyDraftsClick}
              >
                <Icon type="draft" className="sidebar__entry-menu-buttons_draft-button-icon" />
                <span className="sidebar__entry-menu-buttons_draft-button-label">{intl.formatMessage(entryMessages.gotoMyDrafts)}</span>
              </div>
            </div>
          </div>
        );
    }
    render () {
        const { activeDashboard, intl, location, loggedProfileData } = this.props;
        const menu = (
          <div onClick={this.hide}>
            <div
              onClick={this.navigateToProfile}
              className="popover-menu__item"
            >
              {intl.formatMessage(generalMessages.viewProfile)}
            </div>
            <div
              onClick={this.props.profileEditToggle}
              className="popover-menu__item"
            >
              {intl.formatMessage(generalMessages.editProfile)}
            </div>
            <div className="popover-menu__item">
              <Link className="unstyled-link" to="/profileoverview/settings">
                {intl.formatMessage(generalMessages.userSettings)}
              </Link>
            </div>
            <div className="popover-menu__item">
              <Link className="unstyled-link" to="/profileoverview/preferences">
                {intl.formatMessage(generalMessages.appPreferences)}
              </Link>
            </div>
            <div
              onClick={this._handleLogout}
              className="popover-menu__item"
            >
              {intl.formatMessage(generalMessages.logout)}
            </div>
          </div>
        );

        return (
          <div className={`sidebar ${this._isSidebarVisible(location) && 'sidebar_shown'}`}>
            <div className="sidebar__top-icons">
              <div className="flex-center-x sidebar__new-entry">
                <Popover
                  arrowPointAtCenter
                  placement="right"
                  content={this._getEntryMenu()}
                  overlayClassName="entry-menu-popover"
                >
                  <div className="content-link flex-center sidebar__new-entry-wrapper">
                    <Icon
                      className="sidebar__new-entry-icon"
                      type="newEntry"
                    />
                  </div>
                </Popover>
              </div>
              <SidebarIcon
                activePath="/dashboard"
                linkTo={`/dashboard/${activeDashboard || ''}`}
                iconType="dashboard"
                tooltipTitle={intl.formatMessage(generalMessages.sidebarTooltipDashboard)}
              />
              <SidebarIcon
                activePath="/profileoverview"
                className="sidebar__profile-icon"
                linkTo="/profileoverview/myentries"
                iconType="profileOverview"
                tooltipTitle={intl.formatMessage(generalMessages.sidebarTooltipProfile)}
              />
              {/* <SidebarIcon
                activePath="/community"
                linkTo="/community"
                iconType="community"
                tooltipTitle={intl.formatMessage(generalMessages.sidebarTooltipCommunity)}
                disabled
              /> */}
              <SidebarIcon
                activePath="/search"
                linkTo="/search/entries"
                iconType="search"
                tooltipTitle={intl.formatMessage(generalMessages.sidebarTooltipSearch)}
              />
              <SidebarIcon
                activePath="/chat"
                linkTo="/chat"
                iconType="chat"
                tooltipTitle={intl.formatMessage(generalMessages.sidebarTooltipChat)}
                disabled
              />
            </div>
            <div className="flex-center-x content-link sidebar__progress-wrapper">
              <ManaPopover />
            </div>
            <div className="flex-center-x content-link sidebar__progress-wrapper">
              <EssencePopover />
            </div>
            <div className="flex-center-x content-link sidebar__progress-wrapper">
              <KarmaPopover />
            </div>
            <div className="flex-center-x sidebar__avatar">
              <Popover
                arrowPointAtCenter
                placement="topRight"
                content={this.wasVisible ? menu : null}
                trigger="click"
                overlayClassName="popover-menu"
                visible={this.state.visible}
                onVisibleChange={this.handleVisibleChange}
              >
                <Avatar
                  firstName={loggedProfileData.get('firstName')}
                  image={loggedProfileData.get('avatar')}
                  lastName={loggedProfileData.get('lastName')}
                  size="small"
                />
              </Popover>
            </div>
          </div>
        );
    }
}

Sidebar.propTypes = {
    activeDashboard: PropTypes.string,
    drafts: PropTypes.shape(),
    draftCreate: PropTypes.func,
    draftsGet: PropTypes.func,
    draftsFetched: PropTypes.bool,
    fetchingDrafts: PropTypes.bool,
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    isProfileEditToggled: PropTypes.bool,
    location: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    profileEditToggle: PropTypes.func,
    profileLogout: PropTypes.func,
    userSelectedLicense: PropTypes.shape(),
};

function mapStateToProps (state) {
    return {
        activeDashboard: state.dashboardState.get('activeDashboard'),
        draftsCount: state.draftState.get('draftsCount'),
        drafts: state.draftState.get('drafts'),
        draftsFetched: state.draftState.get('draftsFetched'),
        fetchingDrafts: state.draftState.get('fetchingDrafts'),
        isProfileEditToggled: selectProfileEditToggle(state),
        loggedProfile: selectLoggedProfile(state),
        loggedProfileData: selectLoggedProfileData(state),
        userSelectedLicense: state.settingsState.getIn(['userSettings', 'defaultLicense'])
    };
}

export default connect(
    mapStateToProps,
    {
        draftCreate,
        profileEditToggle,
        profileLogout,
        draftsGet,
    },
    null,
    {
        pure: false
    }
)(withRouter(injectIntl(Sidebar)));
