import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { AutoComplete, Button, Input, Tag } from 'antd';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectTagEntriesCount, selectTagSearchResults } from '../../local-flux/selectors';
import { searchTags } from '../../local-flux/actions/search-actions';
import { profileToggleInterest } from '../../local-flux/actions/profile-actions';
import { dashboardAddFirst } from '../../local-flux/actions/dashboard-actions';
import { generalMessages, searchMessages, setupMessages } from '../../locale-data/messages';
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
            const { history } = this.props;
            history.push('/dashboard/first');
        }
    }

    componentDidMount () {
        this.input.focus();
    }

    getInputRef = (el) => { this.input = el; };

    handleInputChange = (ev) => {
        this.setState({
            query: ev.target.value
        });
    };

    handleKeyDown = (ev) => {
        if (ev.key === 'Enter') {
            if (!this.selecting) {
                this.handleSearch();
            }
            this.selecting = false;
        }
    }

    handleSearch = () => this.props.searchTags(this.state.query);

    onChange = (val) => {
        this.setState({ query: val });
        this.props.searchTags(val);
    }

    onSelect = (val) => {
        this.setState({ query: val });
        this.props.searchTags(val);
        this.selecting = true;
    }


    handleSkipStep = () => {
        this.props.dashboardAddFirst();
    };

    handleSubmit = () => {
        this.props.dashboardAddFirst(this.props.profileInterests.toJS());
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
                <AutoComplete
                  dataSource={tags}
                  onChange={this.onChange}
                  onSearch={this.handleSearch}
                  onSelect={this.onSelect}
                  size="large"
                  value={this.state.query}
                >
                  <Input
                    ref={this.getInputRef}
                    onKeyDown={this.handleKeyDown}
                    size="large"
                    placeholder={intl.formatMessage(searchMessages.searchSomething)}
                    prefix={<Icon onClick={this.handleSearch} type="search" />}
                  />
                </AutoComplete>
                <TagListInterests
                  contextId={SEARCH}
                  entriesCount={entriesCount}
                  fetchingTags={fetchingTags}
                  profileInterests={profileInterests}
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
    dashboardAddFirst: PropTypes.func.isRequired,
    entriesCount: PropTypes.shape().isRequired,
    firstDashboardReady: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    fetchingTags: PropTypes.bool,
    history: PropTypes.shape().isRequired,
    profileInterests: PropTypes.shape().isRequired,
    profileToggleInterest: PropTypes.func.isRequired,
    tags: PropTypes.shape().isRequired,
    searchTags: PropTypes.func.isRequired,
};

function mapStateToProps (state) {
    return {
        entriesCount: selectTagEntriesCount(state),
        fetchingTags: state.tagState.getIn(['flags', 'searchPending']),
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
    }
)(injectIntl(NewIdentityInterests));
