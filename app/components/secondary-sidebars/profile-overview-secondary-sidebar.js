import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { profileLogout } from '../../local-flux/actions/profile-actions';
import { generalMessages, profileMessages } from '../../locale-data/messages';

class ProfileOverviewSecondarySidebar extends Component {
    checkActiveRoute = (name) => {
        const { location } = this.props;
        return `profile-overview-sidebar__link-title ${location.pathname.includes(name) &&
             'profile-overview-sidebar__link-title_active'}`;
    }

    render () {
        const { intl } = this.props;
        return (
          <div className="profile-overview-sidebar">
            <div className="profile-overview-sidebar__title">
              {intl.formatMessage(profileMessages.myProfile)}
            </div>
            <div className="profile-overview-sidebar__menu">
              <Link to="/profileoverview/overview" className="profile-overview-sidebar__link">
                <div className={this.checkActiveRoute('profileoverview/overview')}>
                  {intl.formatMessage(profileMessages.overview)}
                </div>
              </Link>
              <Link to="/profileoverview/mybalance" className="profile-overview-sidebar__link">
                <div className={this.checkActiveRoute('profileoverview/mybalance')}>
                  {intl.formatMessage(profileMessages.myBalance)}
                </div>
              </Link>
              <Link to="/profileoverview/rewardsandgoals" className="profile-overview-sidebar__link">
                <div className={this.checkActiveRoute('profileoverview/rewardsandgoals')}>
                  {intl.formatMessage(profileMessages.rewardsAndGoals)}
                </div>
              </Link>
              <Link to="/profileoverview/contacts" className="profile-overview-sidebar__link">
                <div className={this.checkActiveRoute('profileoverview/contacts')}>
                  {intl.formatMessage(profileMessages.contacts)}
                </div>
              </Link>
              <Link to="/profileoverview/entries" className="profile-overview-sidebar__link">
                <div className={this.checkActiveRoute('profileoverview/entries')}>
                  {intl.formatMessage(profileMessages.entries)}
                </div>
              </Link>
              <Link to="/profileoverview/highlights" className="profile-overview-sidebar__link">
                <div className={this.checkActiveRoute('profileoverview/highlights')}>
                  {intl.formatMessage(profileMessages.highlights)}
                </div>
              </Link>
              <Link to="/profileoverview/lists" className="profile-overview-sidebar__link">
                <div className={this.checkActiveRoute('profileoverview/lists')}>
                  {intl.formatMessage(profileMessages.lists)}
                </div>
              </Link>
              <Link to="/profileoverview/settings" className="profile-overview-sidebar__link">
                <div className={this.checkActiveRoute('profileoverview/settings')}>
                  {intl.formatMessage(profileMessages.settings)}
                </div>
              </Link>
            </div>
            <div className="profile-overview-sidebar__line-wrapper">
              <div className="profile-overview-sidebar__line" />
            </div>
            <div className="profile-overview-sidebar__logout-wrapper">
              <div
                onClick={this.props.profileLogout}
                className="profile-overview-sidebar__logout"
              >
                {intl.formatMessage(generalMessages.logout)}
              </div>
            </div>
          </div>
        );
    }
}


ProfileOverviewSecondarySidebar.propTypes = {
    intl: PropTypes.shape(),
    location: PropTypes.shape(),
    profileLogout: PropTypes.func
};

function mapStateToProps () {
    return {};
}

export default connect(
    mapStateToProps,
    {
        profileLogout
    }
)(injectIntl(ProfileOverviewSecondarySidebar));
