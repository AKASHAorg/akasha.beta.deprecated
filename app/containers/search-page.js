import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { EntryListContainer } from '../shared-components';


class SearchPage extends Component {

    render () {
        return (
          <EntryListContainer
            cardStyle={{ width: '700px' }}
            contextId={'search'}
            entries={entries}
            fetchingEntries={searchState.getIn(['flags', 'queryPending'])}
            fetchingMoreEntries={searchState.getIn(['flags', 'queryMorePending'])}
            fetchMoreEntries={this.searchMoreQuery}
            moreEntries={searchState.getIn(['flags', 'moreEntries'])}
            placeholderMessage={placeholderMessage}
            profiles={profiles}
          />
        );
    }
}

SearchPage.propTypes = {
    column: PropTypes.shape().isRequired,
    entries: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    profiles: PropTypes.shape().isRequired
};

function mapStateToProps (state) {
    return {
        entries: state.searchState.get(''),
        profiles: state.profileState.get('byId')
    };
}

export default connect(
    mapStateToProps,
    {}
)(SearchPage);
