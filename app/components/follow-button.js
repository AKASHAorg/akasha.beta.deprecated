import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Button, Spin } from 'antd';
import classNames from 'classnames';
import { Icon } from './';
import { generalMessages, profileMessages } from '../locale-data/messages';

class FollowButton extends Component {
    state = {
        hovered: false
    };

    onMouseEnter = () => {
        this.setState({
            hovered: true
        });
    };

    onMouseLeave = () => {
        this.setState({
            hovered: false
        });
    };

    render () {
        const { followPending, intl, isFollower, onFollow } = this.props;
        const { hovered } = this.state;
        const canFollow = !isFollower && !followPending;
        let label;
        if (followPending) {
            label = (
                <div className="flex-center">
                    <Spin className="follow-button__button-icon" size="small" />
                    {intl.formatMessage(generalMessages.pending)}
                </div>
            );
        } else if (isFollower) {
            const message = hovered
                ? intl.formatMessage(profileMessages.unfollow)
                : intl.formatMessage(profileMessages.following);
            label = (
                <div className="flex-center">
                    <Icon className="follow-button__button-icon" type={hovered ? 'close' : 'check'} />
                    {message}
                </div>
            );
        } else {
            label = (
                <div className="flex-center">
                    <Icon className="follow-button__button-icon" type="plus" />
                    {intl.formatMessage(profileMessages.follow)}
                </div>
            );
        }
        const className = classNames('follow-button__button', {
            'follow-button__unfollow-button': !followPending && isFollower && hovered,
            'follow-button__following-button': !followPending && isFollower && !hovered,
            'follow-button__follow-button': !followPending && !isFollower
        });

        return (
            <Button
                className={className}
                disabled={followPending}
                onClick={onFollow}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                type={canFollow ? 'primary' : 'default'}
            >
                {label}
            </Button>
        );
    }
}

FollowButton.propTypes = {
    followPending: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    isFollower: PropTypes.bool,
    onFollow: PropTypes.func.isRequired
};

export default injectIntl(FollowButton);
