import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon, Tooltip } from 'antd';
import { profileMessages } from '../../locale-data/messages';
import { Navigation } from '../';

const ProfilePageTopBar = (props) => {
    const { history, intl } = props;

    const scrollColumnIntoView = (id) => {
        const container = document.getElementById('profile-activity');
        const column = document.getElementById(id);
        const profileDetailsWidth = 352;
        const columnLeftOffset = column.offsetLeft - profileDetailsWidth;
        const scrollLeft = (columnLeftOffset - (container.clientWidth / 2)) + (column.clientWidth / 2);
        container.scrollLeft = scrollLeft;
    };

    return (
      <div className="flex-center-y profile-page-top-bar">
        <Navigation />
        <Tooltip title={intl.formatMessage(profileMessages.entries)}>
          <Icon
            className="content-link profile-page-top-bar__column-icon"
            onClick={() => scrollColumnIntoView('profile-entries')}
            type="copy"
          />
        </Tooltip>
        <Tooltip title={intl.formatMessage(profileMessages.followers)}>
          <Icon
            className="content-link profile-page-top-bar__column-icon"
            onClick={() => scrollColumnIntoView('profile-followers')}
            type="copy"
          />
        </Tooltip>
        <Tooltip title={intl.formatMessage(profileMessages.followings)}>
          <Icon
            className="content-link profile-page-top-bar__column-icon"
            onClick={() => scrollColumnIntoView('profile-followings')}
            type="copy"
          />
        </Tooltip>
      </div>
    );
};

ProfilePageTopBar.propTypes = {
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired
};

export default injectIntl(ProfilePageTopBar);
