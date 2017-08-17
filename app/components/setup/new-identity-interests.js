import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Icon, Input, Tabs } from 'antd';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectTagGetEntriesCount } from '../../local-flux/selectors';
import { tagSearch, tagSearchMore } from '../../local-flux/actions/tag-actions';
import { profileToggleInterest } from '../../local-flux/actions/profile-actions';
import { dashboardAddFirst } from '../../local-flux/actions/dashboard-actions';
import { generalMessages, setupMessages } from '../../locale-data/messages';
import { TagListInterests } from '../../components';
import { SEARCH } from '../../constants/context-types';
import * as columnTypes from '../../constants/columns';

class NewIdentityInterests extends Component {
    constructor (props) {
        super(props);
        this.state = {
            disableSubmit: false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.firstDashboardReady === true) {
            const { history } = this.props;
            history.push('/dashboard/first');
        }
    }

    getMoreTags = () => {
        const { entriesCount, query } = this.props;
        this.props.tagSearchMore(query, entriesCount.size);
    };

    handleInputChange = (event) => {
        this.props.tagSearch(event.target.value);
    };

    handleSkipStep = () => {
        const { history } = this.props;
        history.push('/dashboard');
    };

    handleSubmit = () => {
        this.props.dashboardAddFirst(this.props.profileInterests);
        this.setState({ disableSubmit: true });
    };

    render () {
        const { entriesCount, intl, fetchingTags, fetchingMoreTags,
            query, profileInterests, resultsCount } = this.props;
        const checkMoreTags = resultsCount > entriesCount.size;
        const TabPane = Tabs.TabPane;
        const disabledSubmit = (profileInterests.get(columnTypes.tag).size === 0 &&
            profileInterests.get(columnTypes.profile).size === 0) || this.state.disableSubmit;

        return (
          <div className="setup-content setup-content__column_full">
            <div className="setup-content__column-content new-identity-interests">
              <div className="new-identity-interests__left">
                <div>
                  <div className="new-identity-interests__left-bold-text">
                    {intl.formatMessage(setupMessages.interestedIn)}
                  </div>
                  <span>{intl.formatMessage(setupMessages.interestSuggestion)}</span>
                </div>
                <div className="new-identity-interests__left-interests">
                  {profileInterests.get(columnTypes.tag) &&
                    profileInterests[columnTypes.tag].map(interest =>
                      (<Button
                        key={interest}
                        icon="close"
                        onClick={() => this.props.profileToggleInterest(interest, columnTypes.tag)}
                      >
                        {interest}
                      </Button>)
                    )}
                </div>
              </div>
              <div className="new-identity-interests__right">
                <Input
                  autoFocus
                  onChange={this.handleInputChange}
                  value={query}
                  size="large"
                  placeholder="Search something..."
                  prefix={<Icon type="search" />}
                />
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Tags" key="1">
                    <TagListInterests
                      contextId={SEARCH}
                      tags={entriesCount}
                      fetchingTags={fetchingTags}
                      fetchingMoreTags={fetchingMoreTags}
                      fetchMoreTags={this.getMoreTags}
                      moreTags={checkMoreTags}
                      toggleInterest={this.props.profileToggleInterest}
                      profileInterests={profileInterests}
                    />
                  </TabPane>
                  <TabPane tab="People" key="2">
                  </TabPane>
                </Tabs>
              </div>
            </div>
            <div className="setup-content__column-footer new-identity-interests__footer">
              <div className="content-link" onClick={this.handleSkipStep}>
                  Skip this step <Icon type="arrow-right" />
              </div>
              <Button
                className="new-identity__button"
                disabled={disabledSubmit}
                onClick={this.handleSubmit}
                size="large"
                type="primary"
              >
                {intl.formatMessage(generalMessages.submit)}
              </Button>
            </div>
          </div>
        );
    }
}

NewIdentityInterests.propTypes = {
    dashboardAddFirst: PropTypes.func,
    entriesCount: PropTypes.shape(),
    firstDashboardReady: PropTypes.bool,
    intl: PropTypes.shape(),
    fetchingMoreTags: PropTypes.bool,
    fetchingTags: PropTypes.bool,
    history: PropTypes.shape(),
    profileInterests: PropTypes.shape(),
    profileToggleInterest: PropTypes.func,
    query: PropTypes.string,
    resultsCount: PropTypes.number,
    tagSearch: PropTypes.func,
    tagSearchMore: PropTypes.func,
};

function mapStateToProps (state) {
    return {
        entriesCount: selectTagGetEntriesCount(state),
        fetchingTags: state.searchState.getIn(['flags', 'queryPending']),
        fetchingMoreTags: state.searchState.getIn(['flags', 'moreQueryPending']),
        firstDashboardReady: state.dashboardState.getIn(['flags', 'firstDashboardReady']),
        resultsCount: state.searchState.get('resultsCount'),
        query: state.searchState.get('query'),
        profileInterests: state.profileState.get('interests')
    };
}


export default connect(
    mapStateToProps,
    {
        dashboardAddFirst,
        profileToggleInterest,
        tagSearch,
        tagSearchMore
    }
)(injectIntl(NewIdentityInterests));
