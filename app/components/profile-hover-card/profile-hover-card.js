import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import { IconButton, Paper, RaisedButton, SvgIcon } from 'material-ui';
import * as actionTypes from '../../constants/action-types';
import { profileMessages } from '../../locale-data/messages';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { selectLoggedAkashaId } from '../../local-flux/selectors';
import { Avatar, DataLoader } from '../';
import { getInitials } from '../../utils/dataModule';
import { UserDonate } from '../svg';
import styles from './profile-hover-card.scss';

class ProfileHoverCard extends Component {

    state = {
        isHovered: false
    };

    onMouseEnter = () => {
        this.setState({
            isHovered: true
        });
    };

    onMouseLeave = () => {
        this.setState({
            isHovered: false
        });
    };

    onTip = () => {
        const { loggedAkashaId, profile } = this.props;
        this.props.actionAdd(loggedAkashaId, actionTypes.sendTip, {
            akashaId: profile.akashaId,
            firstName: profile.firstName,
            lastName: profile.lastName,
            receiver: profile.profile,
        });
    };

    onFollow = () => {
        const { loggedAkashaId, profile } = this.props;
        const payload = { akashaId: profile.akashaId };
        this.props.actionAdd(loggedAkashaId, actionTypes.follow, payload);
    };

    onUnfollow = () => {
        const { loggedAkashaId, profile } = this.props;
        const payload = { akashaId: profile.akashaId };
        this.props.actionAdd(loggedAkashaId, actionTypes.unfollow, payload);
    };

    getPosition = () => {
        const { anchorNode, containerNode } = this.props;
        let left;
        let top;
        if (containerNode) {
            const anchorRect = anchorNode.getBoundingClientRect();
            const containerRect = containerNode.getBoundingClientRect();
            left = anchorRect.left - containerRect.left;
            top = anchorRect.bottom - containerRect.top;
        } else {
            left = anchorNode.offsetLeft;
            top = anchorNode.offsetTop + (anchorNode.getBoundingClientRect().height);
        }

        return {
            left,
            top
        };
    };

    render () {
        const { anchorNode, anchorHovered, followPending, intl, isFollowing,
            loading, loggedAkashaId, profile, sendingTip } = this.props;
        if (!anchorNode || (!anchorHovered && !this.state.isHovered)) {
            return null;
        }
        const profileInitials = getInitials(profile.firstName, profile.lastName);
        const isLoggedProfile = profile.akashaId === loggedAkashaId;
        const followersCountMessage = intl.formatMessage(profileMessages.followersCount, {
            followers: profile.followersCount
        });
        const { left, top } = this.getPosition();

        return (
          <div
            className={`${styles.rootWrapper} ${styles.popover}`}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            style={{ left, top }}
          >
            <Paper className={styles.root} zDepth={1}>
              <DataLoader flag={loading}>
                <div>
                  <div className="caret-up" />
                  <div className={`${styles.hoverCardHeader} row`}>
                    <div className={`${styles.avatar} col-xs-3 start-xs`}>
                      <Link to={`/@${profile.akashaId}`}>
                        <Avatar
                          userInitials={profileInitials}
                          image={profile.avatar}
                          style={{ cursor: 'pointer' }}
                        />
                      </Link>
                    </div>
                    {!isLoggedProfile &&
                      <div className={`${styles.cardActions} col-xs-9`}>
                        <div className="row end-xs">
                          <div className={`${styles.tipButton} col-xs-3`}>
                            <IconButton
                              disabled={sendingTip}
                              data-tip={intl.formatMessage(profileMessages.sendTip)}
                              onClick={this.onTip}
                            >
                              <SvgIcon>
                                <UserDonate />
                              </SvgIcon>
                            </IconButton>
                          </div>
                          <div
                            className={`${styles.followButton} ${isFollowing ? 'col-xs-6' : 'col-xs-5'}`}
                          >
                            <RaisedButton
                              disabled={followPending || isFollowing === undefined}
                              label={isFollowing ?
                                  intl.formatMessage(profileMessages.unfollow) :
                                  intl.formatMessage(profileMessages.follow)
                              }
                              onClick={isFollowing ? this.onUnfollow : this.onFollow}
                              primary={!isFollowing}
                            />
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                  <div className={`${styles.cardBody} row`}>
                    <div className="col-xs-12">
                      <Link to={`/@${profile.akashaId}`}>
                        <div className={styles.profileName}>
                          {profile.firstName} {profile.lastName}
                        </div>
                      </Link>
                    </div>
                    <div className={`${styles.profileDetails} col-xs-12`}>
                      @{profile.akashaId} - {followersCountMessage}
                    </div>
                  </div>
                </div>
              </DataLoader>
            </Paper>
          </div>
        );
    }
}

ProfileHoverCard.defaultProps = {
    profile: {},
    loading: false
};

ProfileHoverCard.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    anchorHovered: PropTypes.bool,
    anchorNode: PropTypes.shape(),
    containerNode: PropTypes.shape(),
    followPending: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    isFollowing: PropTypes.bool,
    loading: PropTypes.bool,
    loggedAkashaId: PropTypes.string,
    profile: PropTypes.shape(),
    sendingTip: PropTypes.bool,
};

function mapStateToProps (state, ownProps) {
    const { profile } = ownProps;
    const loggedAkashaId = selectLoggedAkashaId(state);
    return {
        followPending: state.profileState.getIn(['flags', 'followPending', profile.akashaId]),
        isFollowing: state.profileState.getIn(['isFollower', profile.akashaId]),
        loggedAkashaId,
        sendingTip: state.profileState.getIn(['flags', 'sendingTip', profile.akashaId]),
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
    }
)(injectIntl(ProfileHoverCard));
