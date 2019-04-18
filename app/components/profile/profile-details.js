import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button } from 'antd';
import classNames from 'classnames';
import { Avatar, DisplayName, FollowButton, Icon, ShareLinkModal, TipPopover } from '../';
import * as actionTypes from '../../constants/action-types';
import { generalMessages, profileMessages } from '../../locale-data/messages';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { profileEditToggle, toggleOutsideNavigation } from '../../local-flux/actions/app-actions';
import {
    actionSelectors,
    externalProcessSelectors,
    profileSelectors
} from '../../local-flux/selectors';
import imageCreator, { findBestMatch } from '../../utils/imageUtils';
import { formatBalance } from '../../utils/number-formatter';
import { addPrefix } from '../../utils/url-utils';

class ProfileDetails extends Component {
    state = {
        followHovered: false,
        popoverVisible: false,
    };
    wasVisible = false;

    getBackgroundImageClass = (backgroundImage) => {
        if (!backgroundImage) {
            return {};
        }
        const originalRatio = backgroundImage.width / backgroundImage.height;
        const actualRatio = 400 / 200;
        if (originalRatio > 4 || originalRatio < actualRatio) {
            return 'profile-details__background-image_fixed-width';
        }
        return 'profile-details__background-image_fixed-height';
    }

    onMouseEnter = () => {
        this.setState({
            followHovered: true
        });
    };

    onMouseLeave = () => {
        this.setState({
            followHovered: false
        });
    };

    onFollow = () => {
        const { isFollower, loggedEthAddress, profileData } = this.props;
        const ethAddress = profileData.get('ethAddress');
        const akashaId = profileData.get('akashaId');
        if (isFollower) {
            this.props.actionAdd(loggedEthAddress, actionTypes.unfollow, { akashaId, ethAddress });
        } else {
            this.props.actionAdd(loggedEthAddress, actionTypes.follow, { akashaId, ethAddress });
        }
    };

    onVisibleChange = (popoverVisible) => {
        this.wasVisible = true;
        this.setState({
            popoverVisible
        });
    };

    sendTip = ({ value, message }) => {
        const { ethAddress, loggedEthAddress, profileData } = this.props;
        this.props.actionAdd(loggedEthAddress, actionTypes.sendTip, {
            akashaId: profileData.get('akashaId'),
            ethAddress,
            firstName: profileData.get('firstName'),
            lastName: profileData.get('lastName'),
            message,
            value
        });
    };

    removeClass = (id) => {
        const column = document.getElementById(id);
        if (column) {
            const className = column.getAttribute('class');
            const newClassName = className.replace('column_focused', '');
            column.setAttribute('class', newClassName);
        }
    };

    scrollToColumn = (id) => {
        const container = document.getElementById('profile-activity');
        const column = document.getElementById(id);
        const className = column.getAttribute('class');
        column.setAttribute('class', `${ className } column_focused`);
        setTimeout(() => this.removeClass(id), 500);
        const profileDetailsWidth = 352;
        const columnLeftOffset = column.offsetLeft - profileDetailsWidth;
        const scrollLeft = (columnLeftOffset - (container.clientWidth / 2)) + (column.clientWidth / 2);
        container.scrollLeft = scrollLeft;
    };

    render () {
        if (!this.props.profileData) {
            console.error('no profile data');
        }
        const {
            baseUrl, ethAddress, followPending, intl, isFollower, loggedEthAddress, profileData,
            tipPending
        } = this.props;
        const {
            about, akashaId, avatar, backgroundImage, links, firstName, lastName,
            followersCount, followingCount
        } = profileData.toJS();
        const isOwnProfile = ethAddress === loggedEthAddress;
        const bestMatch = findBestMatch(400, backgroundImage);
        const displayName = firstName || lastName ?
            `${ firstName } ${ lastName }` :
            <DisplayName akashaId={ akashaId } ethAddress={ ethAddress }/>;
        const imageUrl = backgroundImage[bestMatch] ?
            imageCreator(backgroundImage[bestMatch].src, baseUrl) :
            '';
        const url = addPrefix(`/${ ethAddress }`);
        const supportButtonClass = classNames('profile-details__button profile-details__support-button', {
            'profile-details__support-button_disabled': tipPending
        });

        return (
            <div className="profile-details">
                <div className="profile-details__background-image">
                    { imageUrl ?
                        <img
                            alt=""
                            className={ this.getBackgroundImageClass(backgroundImage[bestMatch]) }
                            src={ imageUrl }
                        /> :
                        <div className="profile-details__background-image-placeholder"/>
                    }
                </div>
                <div className="profile-details__avatar-row">
                    <div className="profile-details__avatar-wrapper">
                        <Avatar
                            className="profile-details__avatar"
                            firstName={ firstName }
                            image={ avatar }
                            lastName={ lastName }
                            size="large"
                        />
                    </div>
                    <div className="profile-details__heading">
                        <div className="flex-center-y">
                            <div className="overflow-ellipsis profile-details__name">
                                { displayName }
                            </div>
                            <ShareLinkModal url={ url }/>
                        </div>
                        <div>
                            { (firstName || lastName) && `@${ akashaId }` }
                        </div>
                    </div>
                </div>
                <div className="profile-details__scores-wrapper">
                    <div>
                        { intl.formatMessage(generalMessages.karmaTotalScore) }
                        <span className="profile-details__score">
                  { formatBalance(profileData.karma) }
                </span>
                    </div>
                    <div>
                        { intl.formatMessage(generalMessages.essenceTotalScore) }
                        <span className="profile-details__score">
                  { formatBalance(profileData.essence) }
                </span>
                    </div>
                </div>
                <div className="profile-details__actions">
                    { !isOwnProfile &&
                    <FollowButton
                        followPending={ followPending }
                        isFollower={ isFollower }
                        onFollow={ this.onFollow }
                    />
                    }
                    { !isOwnProfile &&
                    <TipPopover profile={ profileData }>
                        <Button
                            className={ supportButtonClass }
                            disabled={ tipPending }
                        >
                            <div>
                                <Icon
                                    className="profile-details__button-icon"
                                    type="heart"
                                />
                                { intl.formatMessage(profileMessages.support) }
                            </div>
                        </Button>
                    </TipPopover>
                    }
                    { isOwnProfile &&
                    <Button
                        className="profile-details__button"
                        onClick={ this.props.profileEditToggle }
                        type="primary"
                    >
                        { intl.formatMessage(generalMessages.editProfile) }
                    </Button>
                    }
                </div>
                <div className="profile-details__counters-wrapper">
                    <div style={ { marginRight: '12px' } }>
                        <div className="content-link"
                             onClick={ () => this.scrollToColumn('profile-followers') }>
                            { intl.formatMessage(profileMessages.followers) }
                        </div>
                        <div
                            className="content-link profile-details__counter"
                            onClick={ () => this.scrollToColumn('profile-followers') }
                        >
                            { followersCount }
                        </div>
                    </div>
                    <div>
                        <div className="content-link"
                             onClick={ () => this.scrollToColumn('profile-followings') }>
                            { intl.formatMessage(profileMessages.followings) }
                        </div>
                        <div
                            className="content-link profile-details__counter"
                            onClick={ () => this.scrollToColumn('profile-followings') }
                        >
                            { followingCount }
                        </div>
                    </div>
                </div>
                { about &&
                <div className="profile-details__about">
                    { about.split('\n').map((text, key) => (
                        <span key={ key }>
                    { text }
                            <br/>
                  </span>
                    )) }
                </div>
                }
                { links && !!links.length &&
                <div className="profile-details__links-wrapper">
                    { links.map(link => (
                        <a
                            key={ link.id }
                            className="profile-details__link"
                            href={ link.url }
                            onClick={ (ev) => {
                                ev.preventDefault();
                                this.props.toggleOutsideNavigation(link.url);
                            } }
                        >
                            <div className="overflow-ellipsis" style={ { width: '100%' } }>
                                { link.url }
                            </div>
                        </a>
                    )) }
                </div>
                }
            </div>);
    }
}

ProfileDetails.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    baseUrl: PropTypes.string.isRequired,
    ethAddress: PropTypes.string.isRequired,
    followPending: PropTypes.bool,
    intl: PropTypes.shape(),
    isFollower: PropTypes.bool,
    loggedEthAddress: PropTypes.string,
    profileData: PropTypes.shape(),
    profileEditToggle: PropTypes.func.isRequired,
    tipPending: PropTypes.bool,
    toggleOutsideNavigation: PropTypes.func.isRequired,
};

function mapStateToProps (state, ownProps) {
    const { ethAddress } = ownProps;
    return {
        baseUrl: externalProcessSelectors.getBaseUrl(state),
        followPending: actionSelectors.getFollowIsPending(state, ethAddress),
        isFollower: profileSelectors.selectIsFollower(state, ethAddress),
        loggedEthAddress: profileSelectors.selectLoggedEthAddress(state),
        profileData: profileSelectors.selectProfileByEthAddress(state, ethAddress),
        tipPending: actionSelectors.getTipIsPending(state, ethAddress)
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        profileEditToggle,
        toggleOutsideNavigation
    }
)(injectIntl(ProfileDetails));
