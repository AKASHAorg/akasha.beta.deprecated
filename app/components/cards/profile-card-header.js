import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { profileMessages } from '../../locale-data/messages';
import { getDisplayName } from '../../utils/dataModule';
import { addPrefix } from '../../utils/url-utils';
import { Avatar, Icon, ShareLinkModal, TipPopover } from '../';

const getSubtitle = (profile) => {
    const { akashaId, ethAddress, firstName, lastName } = profile.toJS();
    if (firstName || lastName) {
        return getDisplayName({ akashaId, ethAddress });
    }
    return null;
};

const getTitle = (profile) => {
    const { akashaId, ethAddress, firstName, lastName } = profile.toJS();
    if (firstName || lastName) {
        return `${ firstName } ${ lastName }`;
    }
    return getDisplayName({ akashaId, ethAddress });
};

const ProfileCardHeader = (props) => {
    const { intl, isOwnProfile, loading, profile, tipPending } = props;
    if (loading) {
        return (
            <div className="profile-card-header">
                <div
                    className="profile-card-header__avatar profile-card-header__avatar_placeholder"/>
                <div className="profile-card-header__text">
                    <div className="profile-card-header__title_placeholder"/>
                    <div className="profile-card-header__subtitle_placeholder"/>
                </div>
            </div>
        );
    }
    const ethAddress = profile.get('ethAddress');
    const title = getTitle(profile);
    const subtitle = getSubtitle(profile);
    const tipTooltip = tipPending ?
        intl.formatMessage(profileMessages.sendingTip) :
        intl.formatMessage(profileMessages.sendTip);
    const url = addPrefix(`/${ ethAddress }`);
    const tipIconClass = classNames('profile-card-header__tip-icon', {
        'content-link': !tipPending,
        'profile-card-header__tip-icon_disabled': tipPending
    });

    return (
        <div className="profile-card-header">
            <div className="profile-card-header__avatar-wrapper">
                <Avatar
                    className="profile-card-header__avatar"
                    ethAddress={ ethAddress }
                    firstName={ profile.get('firstName') }
                    image={ profile.get('avatar') }
                    lastName={ profile.get('lastName') }
                    link
                    size="small"
                />
            </div>
            <div className="profile-card-header__text">
                <div className="overflow-ellipsis profile-card-header__title">
                    <Link
                        className="unstyled-link"
                        to={ `/${ ethAddress }` }
                    >
              <span className="content-link">
                { title }
              </span>
                    </Link>
                </div>
                { subtitle &&
                <div className="profile-card-header__subtitle">
                    { subtitle }
                </div>
                }
            </div>
            <div className="flex-center-y">
                { !isOwnProfile &&
                <TipPopover disabled={ tipPending } profile={ profile }>
                    <Tooltip title={ tipTooltip }>
                        <Icon
                            className={ tipIconClass }
                            type="wallet"
                        />
                    </Tooltip>
                </TipPopover>
                }
                <ShareLinkModal url={ url }/>
            </div>
        </div>
    );
};

ProfileCardHeader.propTypes = {
    intl: PropTypes.shape().isRequired,
    isOwnProfile: PropTypes.bool,
    loading: PropTypes.bool,
    tipPending: PropTypes.bool,
    profile: PropTypes.shape(),
};

export default injectIntl(ProfileCardHeader);
