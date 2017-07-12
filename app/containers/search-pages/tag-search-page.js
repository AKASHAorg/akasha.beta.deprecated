import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { selectTagGetEntriesCount } from '../../local-flux/selectors';
import { TagList } from '../../shared-components';
import { tagSearchMore } from '../../local-flux/actions/tag-actions';
import { SEARCH } from '../../constants/context-types';

const TagSearchPage = (props) => {
    const { entriesCount, resultsCount, fetchingTags, fetchingMoreTags, query } = props;
    const checkMoreTags = resultsCount > entriesCount.size;

    const getMoreTags = () => {
        props.tagSearchMore(query, entriesCount.size);
    };

    return (
      <div style={{ height: '100%', position: 'absolute', left: 0, right: 0, padding: '0px 50px' }}>
        <TagList
          style={{ height: '100%', flexFlow: 'row wrap' }}
          contextId={SEARCH}
          tags={entriesCount}
          fetchingTags={fetchingTags}
          fetchingMoreTags={fetchingMoreTags}
          fetchMoreTags={getMoreTags}
          moreTags={checkMoreTags}
        />
      </div>
    );
};

TagSearchPage.propTypes = {
    entriesCount: PropTypes.shape(),
    fetchingMoreTags: PropTypes.bool,
    fetchingTags: PropTypes.bool,
    resultsCount: PropTypes.number,
    query: PropTypes.string,
    tagSearchMore: PropTypes.func
};

function mapStateToProps (state) {
    return {
        entriesCount: selectTagGetEntriesCount(state),
        fetchingTags: state.searchState.getIn(['flags', 'queryPending']),
        fetchingMoreTags: state.searchState.getIn(['flags', 'moreQueryPending']),
        resultsCount: state.searchState.get('resultsCount'),
        query: state.searchState.get('query')
    };
}

export default connect(
    mapStateToProps,
    {
        tagSearchMore
    }
)(TagSearchPage);
