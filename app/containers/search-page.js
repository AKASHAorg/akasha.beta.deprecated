import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { EntryListContainer } from '../shared-components';
import { searchMoreQuery } from '../local-flux/actions/search-actions';
import { selectSearchEntries } from '../local-flux/selectors';


class SearchPage extends Component {

    queryMore = () => {
        const { query, entries } = this.props;
        this.props.searchMoreQuery(query, entries.size);
    }

    render () {
        const { entries, profiles, resultsCount, fetchingEntries, fetchingMoreEntries } = this.props;
        const checkMoreEntries = resultsCount > entries.size;
        return (
          <div style={{ height: '100%', position: 'absolute', left: 0, right: 0, padding: '0px 50px' }}>
            <EntryListContainer
              style={{ height: '100%', flexFlow: 'row wrap' }}
              cardStyle={{ width: '400px' }}
              contextId={'search'}
              entries={entries}
              fetchingEntries={fetchingEntries}
              fetchingMoreEntries={fetchingMoreEntries}
              fetchMoreEntries={this.queryMore}
              moreEntries={checkMoreEntries}
              profiles={profiles}
            />
          </div>
        );
    }
}

SearchPage.propTypes = {
    entries: PropTypes.shape(),
    profiles: PropTypes.shape(),
    fetchingEntries: PropTypes.bool,
    fetchingMoreEntries: PropTypes.bool,
    searchMoreQuery: PropTypes.func,
    searchService: PropTypes.bool,
    query: PropTypes.string,
    resultsCount: PropTypes.number,
};

function mapStateToProps (state) {
    return {
        entries: selectSearchEntries(state),
        profiles: state.profileState.get('byId'),
        fetchingEntries: state.searchState.getIn(['flags', 'queryPending']),
        fetchingMoreEntries: state.searchState.getIn(['flags', 'moreQueryPending']),
        query: state.searchState.get('query'),
        resultsCount: state.searchState.get('resultsCount'),
        searchService: state.searchState.get('searchService')
    };
}

export default connect(
    mapStateToProps,
    {
        searchMoreQuery
    }
)(SearchPage);
