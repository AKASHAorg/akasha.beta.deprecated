import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Tooltip } from 'antd';
import { profileMessages } from '../../locale-data/messages';
import { Icon, Navigation } from '../';

const removeClass = (id) => {
    const column = document.getElementById(id);
    if (column) {
        const className = column.getAttribute('class');
        const newClassName = className.replace('column_focused', '');
        column.setAttribute('class', newClassName);
    }
};

const ProfilePageTopBar = (props) => {
    const { intl } = props;

    const scrollColumnIntoView = (id) => {
        const container = document.getElementById('profile-activity');
        const column = document.getElementById(id);
        const className = column.getAttribute('class');
        column.setAttribute('class', `${ className } column_focused`);
        setTimeout(() => removeClass(id), 500);
        const profileDetailsWidth = 352;
        const columnLeftOffset = column.offsetLeft - profileDetailsWidth;
        const scrollLeft = (columnLeftOffset - (container.clientWidth / 2)) + (column.clientWidth / 2);
        container.scrollLeft = scrollLeft;
    };

    return (
        <div className="flex-center-y profile-page-top-bar">
            <Navigation/>
            <Tooltip title={ intl.formatMessage(profileMessages.entries) }>
                <Icon
                    className="content-link profile-page-top-bar__column-icon"
                    onClick={ () => scrollColumnIntoView('profile-entries') }
                    type="entries"
                />
            </Tooltip>
            <Tooltip title={ intl.formatMessage(profileMessages.comments) }>
                <Icon
                    className="content-link profile-page-top-bar__column-icon"
                    onClick={ () => scrollColumnIntoView('profile-comments') }
                    type="comment"
                />
            </Tooltip>
            <Tooltip title={ intl.formatMessage(profileMessages.followers) }>
                <Icon
                    className="content-link profile-page-top-bar__column-icon"
                    onClick={ () => scrollColumnIntoView('profile-followers') }
                    type="followers"
                />
            </Tooltip>
            <Tooltip title={ intl.formatMessage(profileMessages.followings) }>
                <Icon
                    className="content-link profile-page-top-bar__column-icon"
                    onClick={ () => scrollColumnIntoView('profile-followings') }
                    type="following"
                />
            </Tooltip>
        </div>
    );
};

ProfilePageTopBar.propTypes = {
    intl: PropTypes.shape().isRequired
};

export default injectIntl(ProfilePageTopBar);
