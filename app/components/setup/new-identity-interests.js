import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Input, Tag } from 'antd';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectTagEntriesCount, selectTagSearchResults } from '../../local-flux/selectors';
import { searchTags } from '../../local-flux/actions/search-actions';
import { profileToggleInterest } from '../../local-flux/actions/profile-actions';
import { dashboardAddFirst } from '../../local-flux/actions/dashboard-actions';
import { navBackCounterReset } from '../../local-flux/actions/app-actions';
import { dashboardMessages, generalMessages, searchMessages,
    setupMessages } from '../../locale-data/messages';
import { Icon, TagListInterests } from '../';
import { SEARCH } from '../../constants/context-types';
import * as columnTypes from '../../constants/columns';

class NewIdentityInterests extends Component {
    constructor (props) {
        super(props);
        this.state = {
            disableSubmit: false,
            query: ''
        };
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.firstDashboardReady === true) {
            const { history, firstDashboardId } = this.props;
            history.push(`/dashboard/${firstDashboardId}`);
        }
    }

    componentDidMount () {
        this.input.focus();
        this.props.navBackCounterReset();
    }

    getInputRef = (el) => { this.input = el; };

    onChange = (ev) => {
        this.setState({ query: ev.target.value });
        this.props.searchTags(ev.target.value);
    }

    handleSkipStep = () => {
        const name = this.props.intl.formatMessage(dashboardMessages.firstDashboard);
        this.props.dashboardAddFirst(name);
    };

    handleSubmit = () => {
        const name = this.props.intl.formatMessage(dashboardMessages.firstDashboard);
        this.props.dashboardAddFirst(name, this.props.profileInterests.toJS());
        this.setState({ disableSubmit: true });
    };

    render () {
        const { entriesCount, intl, fetchingTags, profileInterests, tags } = this.props;
        const disabledSubmit = profileInterests.get(columnTypes.tag).size === 0 || this.state.disableSubmit;

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
                  {profileInterests.get(columnTypes.tag).map(interest => (
                    <Tag
                      className="new-identity-interests__tag"
                      closable
                      key={interest}
                      onClose={() => this.props.profileToggleInterest(interest, columnTypes.tag)}
                    >
                      {interest}
                    </Tag>
                  ))}
                </div>
              </div>
              <div className="new-identity-interests__right">
                <Input
                  onChange={this.onChange}
                  placeholder={intl.formatMessage(searchMessages.searchSomething)}
                  prefix={<Icon type="search" />}
                  ref={this.getInputRef}
                  size="large"
                  value={this.state.query}
                />
                <TagListInterests
                  contextId={SEARCH}
                  entriesCount={entriesCount}
                  fetchingTags={fetchingTags}
                  profileInterests={profileInterests}
                  query={this.state.query}
                  tags={tags}
                  toggleInterest={this.props.profileToggleInterest}
                />
              </div>
            </div>
            <div className="setup-content__column-footer new-identity-interests__footer">
              <div className="content-link flex-center-y" onClick={this.handleSkipStep}>
                {intl.formatMessage(generalMessages.skipStep)}
                <Icon className="new-identity-interests__skip-icon" type="arrowRight" />
              </div>
              <Button
                className="new-identity__button"
                disabled={disabledSubmit}
                onClick={this.handleSubmit}
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
    dashboardAddFirst: PropTypes.func.isRequired,
    entriesCount: PropTypes.shape().isRequired,
    firstDashboardId: PropTypes.string,
    firstDashboardReady: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    fetchingTags: PropTypes.bool,
    history: PropTypes.shape().isRequired,
    navBackCounterReset: PropTypes.func,
    profileInterests: PropTypes.shape().isRequired,
    profileToggleInterest: PropTypes.func.isRequired,
    tags: PropTypes.shape().isRequired,
    searchTags: PropTypes.func.isRequired,
};

function mapStateToProps (state) {
    const firstDashboard = state.dashboardState.get('byId').first(); 
    return {
        entriesCount: selectTagEntriesCount(state),
        fetchingTags: state.tagState.getIn(['flags', 'searchPending']),
        firstDashboardId: firstDashboard && firstDashboard.get('id'),
        firstDashboardReady: state.dashboardState.getIn(['flags', 'firstDashboardReady']),
        profileInterests: state.profileState.get('interests'),
        tags: selectTagSearchResults(state)
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardAddFirst,
        profileToggleInterest,
        searchTags,
        navBackCounterReset
    }
)(injectIntl(NewIdentityInterests));
