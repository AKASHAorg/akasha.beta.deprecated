import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import Waypoint from 'react-waypoint';
import Link from 'react-router-dom/Link';
import classNames from 'classnames';
import { Card, Popover, Progress, Spin, Tooltip } from 'antd';
import { Avatar, Icon } from '../';
import { getDisplayName } from '../../utils/dataModule';
import { profileKarmaRanking, profileKarmaRankingLoadMore,
    profileGetData, profileIsFollower } from '../../local-flux/actions/profile-actions';
import { getLoggedProfileData } from '../../local-flux/selectors';
import { generalMessages, profileMessages } from '../../locale-data/messages';
import { balanceToNumber } from '../../utils/number-formatter';
import { selectAllFollowings, selectProfilesByEthAddress, selectKarmaRanking, selectProfileFlag } from '../../local-flux/selectors/profile-selectors';

const DEFAULT = 'default';
const LEADERBOARD = 'leaderboard';

class KarmaPopover extends Component {
    state = {
        page: DEFAULT,
        popoverVisible: false
    };
    wasVisible = false;

    componentWillUnmount () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    componentWillReceiveProps (nextProps) {
        const { karmaRanking } = nextProps;
        const { profiles } = this.props;
        const above = karmaRanking.get('above') || [];
        const below = karmaRanking.get('below') || [];
        const defaultState = karmaRanking.get('defaultState') || [];
        const self = this;
        function getData (curr, next) {
            if (curr !== next) {
                const followings = curr.map((profile) => {
                    if (!profiles.get(profile.ethAddress)) {
                        self.props.profileGetData({ ethAddress: profile.ethAddress, full: true });
                    }
                    return profile.ethAddress;
                });
                if (followings.length) {
                    self.props.profileIsFollower(followings);
                }
            }
        }
        getData(defaultState, this.props.karmaRanking.get('defaultState'));
        getData(above, this.props.karmaRanking.get('above'));
        getData(below, this.props.karmaRanking.get('below'));
    }

    onVisibleChange = (popoverVisible) => {
        this.wasVisible = true;
        this.setState({
            popoverVisible
        });
        if (popoverVisible) {
            this.props.profileKarmaRanking();
        }
        if (!popoverVisible) {
            // Delay state reset until popover animation is finished
            this.timeout = setTimeout(() => {
                this.timeout = null;
                this.setState({
                    page: DEFAULT
                });
            }, 100);
        }
    };

    onShowMore = () => {
        if (!this.props.karmaRankingPending) {
            this.setState({ page: LEADERBOARD });
        }
    };

    onCancel = () => { this.setState({ page: DEFAULT }); };

    getName = (ethAddress) => {
        const { profiles } = this.props;
        const akashaId = profiles.get(ethAddress) ?
            profiles.getIn([ethAddress, 'akashaId']) :
            null;
        return getDisplayName({ akashaId, ethAddress });
    }

    renderCard = (profile, profiles, intl, loggedProfileData) => {
        const profileKarmaScore = profile.karma;
        const isOwnprofile = profile.ethAddress === loggedProfileData.get('ethAddress');
        const userName = isOwnprofile ? intl.formatMessage(generalMessages.you) :
            this.getName(profile.ethAddress);
        return (
          <Card
            key={profile.ethAddress}
            hoverable={false}
            className={classNames('karma-popover__profile-card',
              { 'karma-popover__profile-card_self': isOwnprofile })}
          >
            <div className="karma-popover__card-content">
              <div className="karma-popover__card-left">
                <div className={classNames('karma-popover__card-rank',
                  { 'karma-popover__card-rank_blue': isOwnprofile })}
                >
                  {profile.rank + 1}
                </div>
                <Link
                  className="karma-popover__avatar-link"
                  onClick={() => this.onVisibleChange(false)}
                  to={`/${profile.ethAddress}`}
                >
                  <Avatar
                    className="karma-popover__avatar"
                    firstName={profiles.get(profile.ethAddress)
                      && profiles.getIn([profile.ethAddress, 'firstName'])}
                    image={profiles.get(profile.ethAddress)
                      && profiles.getIn([profile.ethAddress, 'avatar'])}
                    lastName={profiles.get(profile.ethAddress)
                      && profiles.getIn([profile.ethAddress, 'lastName'])}
                    size="small"
                  />
                </Link>
                <div className="karma-popover__card-name">
                  <Link
                    className="unstyled-link"
                    onClick={() => this.onVisibleChange(false)}
                    to={`/${profile.ethAddress}`}
                  >
                    {userName}
                  </Link>
                </div>
              </div>
              <div className="karma-popover__card-score">
                {intl.formatMessage(generalMessages.karmaScore, { profileKarmaScore })}
              </div>
            </div>
          </Card>
        );
    }

    constructLeaderboardList = (karmaRanking) => {
        const above = karmaRanking.get('above') || [];
        const below = karmaRanking.get('below') || [];
        const defaultState = karmaRanking.get('defaultState') || [];
        let leaderboardList = [];
        if (defaultState.length) {
            leaderboardList = leaderboardList.concat(above);
            leaderboardList = leaderboardList.concat(defaultState);
            leaderboardList = leaderboardList.concat(below);
        }
        return leaderboardList;
    }
    /*eslint-disable max-statements*/
    renderContent = () => {
        const { allFollowings, intl, loggedProfileData, karmaRanking, profiles,
            karmaRankingPending } = this.props;
        const { page } = this.state;
        const karmaScore = balanceToNumber(loggedProfileData.get('karma'));
        const karmaLevel = Math.floor(karmaScore / 1000);
        const percent = ((karmaScore % 1000) / 1000) * 100;
        const defaultState = karmaRanking.get('defaultState') || [];

        const leaderboardList = this.constructLeaderboardList(karmaRanking);

        const profileDefaultList = defaultState.map(profile =>
            this.renderCard(profile, profiles, intl, loggedProfileData));

        const profileLeaderboardList = leaderboardList.map(profile =>
            this.renderCard(profile, profiles, intl, loggedProfileData));

        const possibleActions = [
            generalMessages.publishEntries,
            generalMessages.vote,
            generalMessages.comment
        ];

        if (karmaLevel > 0) {
            possibleActions.push(generalMessages.createTags);
        }

        if (page === LEADERBOARD) {
            return (
              <div className="karma-popover__leaderboard-page-content">
                <div className="karma-popover__wrap">
                  <div
                    className="karma-popover__back"
                    onClick={this.onCancel}
                  >
                    <Icon
                      type="arrowLeft"
                      className="arrow-left-icon karma-popover__back-icon"
                    />
                  </div>
                  <div className="karma-popover__leaderboard-title">
                    {intl.formatMessage(generalMessages.karmaLeaderboard)}
                  </div>
                </div>
                <div className="karma-popover__leaderboard-content">
                  <div className="karma-popover__leaderboard-wrap">
                    <div>
                      <Waypoint onEnter={() => this.props.profileKarmaRankingLoadMore('above')} />
                    </div>
                    <div className="karma-popover__margin">
                      {karmaRankingPending &&
                        <div className="flex-center-x karma-popover__spin">
                          <Spin />
                        </div>
                      }
                      {!karmaRankingPending &&
                        profileLeaderboardList
                      }
                    </div>
                    <div>
                      <Waypoint onEnter={() => this.props.profileKarmaRankingLoadMore('below')} />
                    </div>
                  </div>
                </div>
              </div>
            );
        }

        return (
          <div className="karma-popover__content">
            <div className="karma-popover__title-wrap">
              <div className="karma-popover__wrap">
                <div className="karma-popover__title">
                  {intl.formatMessage(generalMessages.karma)}
                </div>
                <div className="karma-popover__karma-score">
                  {karmaScore}
                </div>
              </div>
              <div className="karma-popover__tooltip">
                <Tooltip
                  title={intl.formatMessage(generalMessages.karmaPopoverTooltip)}
                  placement="topLeft"
                  arrowPointAtCenter
                >
                  <Icon
                    type="questionCircle"
                    className="question-circle-icon karma-popover__info-icon"
                  />
                </Tooltip>
              </div>
            </div>
            <div className="karma-popover__karma-level">
              {intl.formatMessage(generalMessages.karmaLevel, { karmaLevel })}
            </div>
            <div >
              <Progress
                percent={percent}
                showInfo={false}
                className="karma-popover__progress"
              />
            </div>
            <div className="karma-popover__karma-level-text">
              {intl.formatMessage(generalMessages.karmaLevelInfo)}
            </div>
            <div className="karma-popover__possible-actions">
              {possibleActions.map((action, index) => {
                  const div = (index === possibleActions.length - 1) ?
                    (<div key={index}>{intl.formatMessage(action)}</div>) :
                    (<div style={{ marginRight: '3px' }} key={index}>{intl.formatMessage(action)}, </div>);
                    return div;
              })}
            </div>
            <div className="karma-popover__leaderboard-small-wrap">
              <div className="karma-popover__leaderboard-title-wrap">
                <div className="karma-popover__leaderboard-title">
                  {intl.formatMessage(generalMessages.karmaLeaderboard)}
                </div>
                <div
                  className="karma-popover__show-more"
                  onClick={this.onShowMore}
                >
                  {intl.formatMessage(generalMessages.showMore)}
                </div>
              </div>
              <div>
                {!allFollowings.length &&
                  intl.formatMessage(generalMessages.noFollowings)
                }
                {(!!allFollowings.length && karmaRankingPending) &&
                  <div className="flex-center-x karma-popover__spin">
                    <Spin />
                  </div>
                }
                {(!!allFollowings.length && !karmaRankingPending) &&
                  profileDefaultList
                }
              </div>
            </div>
          </div>
        );
    };

    render () {
        const { loggedProfileData, intl } = this.props;
        const karmaScore = balanceToNumber(loggedProfileData.get('karma'));
        const karmaLevel = Math.floor(karmaScore / 1000);
        const nextLevel = (karmaLevel + 1) * 1000;
        const percent = ((karmaScore % 1000) / 1000) * 100;
        const tooltip = (
          <div>
            <div>{intl.formatMessage(profileMessages.karmaLevel, { karmaLevel })}</div>
            <div>{karmaScore} / {nextLevel}</div>
          </div>
        );

        return (
          <Popover
            content={this.wasVisible ? this.renderContent() : null}
            onVisibleChange={this.onVisibleChange}
            overlayClassName="karma-popover"
            placement="leftBottom"
            trigger="click"
            visible={this.state.popoverVisible}
          >
            <Tooltip
              placement="right"
              title={tooltip}
            >
              <Progress
                className="sidebar__karma-progress"
                format={() => <Icon className="sidebar__karma-icon" type="karma" />}
                percent={percent}
                strokeWidth={10}
                type="circle"
                width={35}
              />
            </Tooltip>
          </Popover>
        );
    }
}

KarmaPopover.propTypes = {
    allFollowings: PropTypes.any,
    intl: PropTypes.shape().isRequired,
    loggedProfileData: PropTypes.shape(),
    profiles: PropTypes.shape(),
    profileGetData: PropTypes.func,
    profileIsFollower: PropTypes.func,
    profileKarmaRanking: PropTypes.func,
    profileKarmaRankingLoadMore: PropTypes.func,
    karmaRanking: PropTypes.shape(),
    karmaRankingPending: PropTypes.bool
};

function mapStateToProps (state) {
    return {
        allFollowings: selectAllFollowings(state),
        loggedProfileData: getLoggedProfileData(state),
        profiles: selectProfilesByEthAddress(state),
        karmaRanking: selectKarmaRanking(state),
        karmaRankingPending:selectProfileFlag(state, 'karmaRankingPending')
    };
}

export default connect(
    mapStateToProps,
    {
        profileKarmaRanking,
        profileKarmaRankingLoadMore,
        profileGetData,
        profileIsFollower
    }
)(injectIntl(KarmaPopover));
