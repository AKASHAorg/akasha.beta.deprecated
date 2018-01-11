import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Card, Popover, Progress, Spin, Tooltip } from 'antd';
import { Avatar, Icon, ProfilePopover } from '../';
import { getDisplayName } from '../../utils/dataModule';
import { profileKarmaRanking } from '../../local-flux/actions/profile-actions';
import { selectLoggedProfileData } from '../../local-flux/selectors';
import { generalMessages, profileMessages } from '../../locale-data/messages';
import { balanceToNumber } from '../../utils/number-formatter';

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

    onShowMore = () => { this.setState({ page: LEADERBOARD }); };

    onCancel = () => { this.setState({ page: DEFAULT }); };

    getName = (ethAddress) => {
        const { profiles } = this.props;
        const akashaId = profiles.get(ethAddress) ?
            profiles.getIn([ethAddress, 'akashaId']) :
            null;
        return getDisplayName({ akashaId, ethAddress });
    }
    /*eslint-disable max-statements*/
    renderContent = () => {
        const { intl, loggedProfileData, karmaRanking, profiles, karmaRankingPending } = this.props;
        const { page } = this.state;
        const collection = karmaRanking.get('collection') || [];
        const myRanking = karmaRanking.get('myRanking') || 0;
        const karmaScore = balanceToNumber(loggedProfileData.get('karma'));
        const karmaLevel = Math.floor(karmaScore / 1000);
        const percent = ((karmaScore % 1000) / 1000) * 100;
        let first, second;
        if (myRanking - 1 < 0) {
            first = myRanking;
            second = myRanking + 3;
            console.log('1st');
        } else if (myRanking + 1 === collection.length) {
            first = myRanking - 2;
            second = myRanking + 1;
            console.log('last');
        } else {
            first = myRanking - 1;
            second = myRanking + 2;
            console.log('middle');
        }
        const defaultList = collection.slice(first, second);
        // console.log(defaultList);

        const profileList = defaultList.map((profile, index) => {
            const profileKarmaScore = profile.karma;
            const isOwnprofile = profile.ethAddress === loggedProfileData.get('ethAddress');
            console.log(profiles.getIn([profile.ethAddress, 'avatar']));
            return (
              <Card
                key={profile.ethAddress}
                hoverable={false}
                className="karma-popover__profile-card"
              >
                <div className="karma-popover__card-content">
                  <div className="karma-popover__card-left">
                    <div className={`karma-popover__card-rank ${isOwnprofile && 'karma-popover__card-rank_blue'}`}>
                      {index + 1}
                    </div>
                    <ProfilePopover ethAddress={profile.ethAddress}>
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
                    </ProfilePopover>
                    <div className="karma-popover__card-name">
                      {this.getName(profile.ethAddress)}
                    </div>
                  </div>
                  <div className="karma-popover__card-score">
                    {intl.formatMessage(generalMessages.karmaScore, { profileKarmaScore })}
                  </div>
                </div>
              </Card>
            );
        });

        if (page === LEADERBOARD) {
            return (
              <div className="karma-popover__content">
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
                  title="placeholder"
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
            <div className="karma-popover__leaderboard-wrap">
              {karmaRankingPending &&
                <div className="flex-center-x karma-popover__spin">
                  <Spin />
                </div>
              }
              {!karmaRankingPending &&
                profileList
              }
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
              placement="topLeft"
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
    intl: PropTypes.shape().isRequired,
    loggedProfileData: PropTypes.shape(),
    profiles: PropTypes.shape(),
    profileKarmaRanking: PropTypes.func,
    karmaRanking: PropTypes.shape(),
    karmaRankingPending: PropTypes.bool

};

function mapStateToProps (state) {
    return {
        loggedProfileData: selectLoggedProfileData(state),
        profiles: state.profileState.get('byEthAddress'),
        karmaRanking: state.profileState.get('karmaRanking'),
        karmaRankingPending: state.profileState.getIn(['flags', 'karmaRankingPending'])
    };
}

export default connect(
    mapStateToProps,
    {
        profileKarmaRanking
    }
)(injectIntl(KarmaPopover));
