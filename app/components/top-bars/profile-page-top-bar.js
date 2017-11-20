import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon, Tooltip } from 'antd';
import { profileMessages } from '../../locale-data/messages';

const ProfilePageTopBar = (props) => {
    const { history, intl } = props;

    const scrollColumnIntoView = (id) => {
        const container = document.getElementById('profile-activity');
        const column = document.getElementById(id);
        const profileDetailsWidth = 352;
        const columnLeftOffset = column.offsetLeft - profileDetailsWidth;
        console.log('column left offset', column.offsetLeft);
        console.log('container width', container.clientWidth);
        const scrollLeft = (columnLeftOffset - (container.clientWidth / 2)) + (column.clientWidth / 2);
        console.log('scroll left', scrollLeft);
        container.scrollLeft = scrollLeft;
    };

    return (
      <div className="flex-center-y profile-page-top-bar">
        <div className="flex-center-y profile-page-top-bar__navigation">
          <Icon className="content-link" onClick={history.goBack} type="left" />
          <Icon className="content-link" onClick={history.goForward} type="right" />
        </div>
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
