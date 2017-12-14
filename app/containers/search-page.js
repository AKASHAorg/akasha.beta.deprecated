import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Input, Tabs } from 'antd';
import { EntryList, Icon, ProfileList, TagList } from '../components';
import { searchMoreQuery, searchProfiles, searchQuery, searchResetResults,
    searchTags } from '../local-flux/actions/search-actions';
import { selectSearchEntries, selectSearchProfiles, selectSearchQuery,
    selectSearchTags, selectTagEntriesCount } from '../local-flux/selectors';
import { generalMessages, searchMessages } from '../locale-data/messages';
import { SEARCH } from '../constants/context-types';

const { TabPane } = Tabs;

class SearchPage extends Component {
    state = {
        activeTab: 'entries'
    };

    componentWillUnmount () {
        this.props.searchResetResults();
    }

    onSearchChange = (ev) => {
        const { activeTab } = this.state;
        this.onSearch(activeTab, ev.target.value);
    };

    selectTab = (tab) => {
        const { query } = this.props;
        this.setState({
            activeTab: tab
        });
        this.onSearch(tab, query);
    };

    onSearch = (tab, query) => {
        switch (tab) {
            case 'entries':
                return this.props.searchQuery(query);
            case 'people':
                return this.props.searchProfiles(query);
            case 'tags':
                return this.props.searchTags(query);
            default:
                return null;
        }
    };

    renderEntryResults () {
        const { entries, resultsCount, fetchingResults, fetchingMoreResults } = this.props;
        const moreEntries = resultsCount > entries.size;
        return (
          <EntryList
            contextId={SEARCH}
            entries={entries}
            fetchingEntries={fetchingResults}
            fetchingMoreEntries={fetchingMoreResults}
            fetchMoreEntries={this.props.searchMoreQuery}
            masonry
            moreEntries={moreEntries}
            style={{ padding: '12px 0px' }}
          />
        );
    }

    renderProfileResults () {
        const { fetchingResults, profiles } = this.props;

        return (
          <ProfileList
            context={SEARCH}
            fetchingProfiles={fetchingResults}
            fetchingMoreProfiles={false}
            fetchMoreProfiles={() => {}}
            moreProfiles={false}
            profiles={profiles}
            style={{ padding: '12px 0px' }}
          />
        );
    }

    renderTagResults () {
        const { fetchingResults, tagEntriesCount, tags } = this.props;
        return (
          <TagList
            entriesCount={tagEntriesCount}
            fetchingTags={fetchingResults}
            tags={tags}
          />
        );
    }

    render () {
        const { intl, query } = this.props;
        const { activeTab } = this.state;

        return (
          <div className="search">
            <div className="search__content">
              <div className="search__input-wrapper">
                <Input
                  onChange={this.onSearchChange}
                  placeholder={intl.formatMessage(searchMessages.searchSomething)}
                  prefix={<Icon type="search" />}
                  size="large"
                  value={query}
                />
              </div>
              <Tabs
                activeKey={activeTab}
                onChange={this.selectTab}
              >
                <TabPane key="entries" tab={intl.formatMessage(generalMessages.entries)}>
                  {this.renderEntryResults()}
                </TabPane>
                <TabPane key="people" tab={intl.formatMessage(generalMessages.people)}>
                  {this.renderProfileResults()}
                </TabPane>
                <TabPane key="tags" tab={intl.formatMessage(generalMessages.tags)}>
                  {this.renderTagResults()}
                </TabPane>
              </Tabs>
            </div>
          </div>
        );
    }
}

SearchPage.propTypes = {
    entries: PropTypes.shape(),
    fetchingResults: PropTypes.bool,
    fetchingMoreResults: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    profiles: PropTypes.shape().isRequired,
    query: PropTypes.string,
    resultsCount: PropTypes.number,
    searchMoreQuery: PropTypes.func.isRequired,
    searchProfiles: PropTypes.func.isRequired,
    searchQuery: PropTypes.func.isRequired,
    searchResetResults: PropTypes.func.isRequired,
    searchTags: PropTypes.func.isRequired,
    tagEntriesCount: PropTypes.shape().isRequired,
    tags: PropTypes.shape().isRequired,
};

function mapStateToProps (state) {
    return {
        entries: selectSearchEntries(state),
        fetchingResults: state.searchState.getIn(['flags', 'queryPending']),
        fetchingMoreResults: state.searchState.getIn(['flags', 'moreQueryPending']),
        profiles: selectSearchProfiles(state),
        query: selectSearchQuery(state),
        resultsCount: state.searchState.get('resultsCount'),
        tagEntriesCount: selectTagEntriesCount(state),
        tags: selectSearchTags(state)
    };
}

export default connect(
    mapStateToProps,
    {
        searchMoreQuery,
        searchProfiles,
        searchQuery,
        searchResetResults,
        searchTags
    }
)(injectIntl(SearchPage));
