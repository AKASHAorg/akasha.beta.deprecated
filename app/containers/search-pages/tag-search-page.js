import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { List, ListItem } from 'material-ui/List';
import { selectTagGetEntriesCount } from '../../local-flux/selectors';
import { TagList } from '../../shared-components';
import { tagSearchMore } from '../../local-flux/actions/tag-actions';

class TagSearchPage extends Component {
    getMoreTags = () => {
        const { query, entriesCount } = this.props;
        this.props.tagSearchMore(query, entriesCount.size);
    }

    render () {
        const { entriesCount, resultsCount, fetchingTags, fetchingMoreTags } = this.props;
        const checkMoreTags = resultsCount > entriesCount.size;
        return (
          <div style={{ height: '100%', position: 'absolute', left: 0, right: 0, padding: '0px 50px' }}>
            <TagList
              style={{ height: '100%', flexFlow: 'row wrap' }}
              contextId={'search'}
              tags={entriesCount}
              fetchingTags={fetchingTags}
              fetchingMoreTags={fetchingMoreTags}
              fetchMoreTags={this.getMoreTags}
              moreTags={checkMoreTags}
            />
          </div>
        );
    }
}

TagSearchPage.propTypes = {
    entriesCount: PropTypes.shape(),
    fetchingMoreTags: PropTypes.bool,
    fetchingTags: PropTypes.bool,
    tagSearchMore: PropTypes.func,
    resultsCount: PropTypes.number,
    query: PropTypes.string
};

function mapStateToProps (state) {
    return {
        entriesCount: selectTagGetEntriesCount(state),
        fetchingTags: state.searchState.getIn(['flags', 'queryPending']),
        fetchingMoreTags: state.searchState.getIn(['flags', 'moreQueryPending']),
        query: state.searchState.get('query'),
        resultsCount: state.searchState.get('resultsCount')
    };
}

export default connect(
    mapStateToProps,
    {
        tagSearchMore
    }
)(TagSearchPage);
