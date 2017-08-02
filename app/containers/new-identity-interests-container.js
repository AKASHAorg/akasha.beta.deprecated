import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NewIdentityInterests } from '../components';
import { selectTagGetEntriesCount } from '../local-flux/selectors';
import { tagSearch, tagSearchMore } from '../local-flux/actions/tag-actions';
import { profileToggleInterest } from '../local-flux/actions/profile-actions';


class NewIdentityInterestsContainer extends Component {
    handleSubmit = () => {
        const history = this.props.history;
        history.push('/dashboard/');
    }

    render () {
        const { entriesCount, resultsCount, fetchingTags, fetchingMoreTags, query } = this.props;
        const checkMoreTags = resultsCount > entriesCount.size;

        return (
          <div className="setup-content setup-content__column_full">
            <div style={{ width: '60%', margin: '40px auto 0', maxWidth: '800px' }}>
              <NewIdentityInterests
                toggleInterest={this.props.profileToggleInterest}
                tagSearch={this.props.tagSearch}
                tagSearchMore={this.props.tagSearchMore}
                entriesCount={entriesCount}
                fetchingMoreTags={fetchingMoreTags}
                fetchingTags={fetchingTags}
                checkMoreTags={checkMoreTags}
                query={query}
              />
            </div>
          </div>
        );
    }
}

NewIdentityInterestsContainer.propTypes = {
    entriesCount: PropTypes.shape(),
    fetchingMoreTags: PropTypes.bool,
    fetchingTags: PropTypes.bool,
    history: PropTypes.shape().isRequired,
    query: PropTypes.string,
    resultsCount: PropTypes.number,
    tagSearch: PropTypes.func,
    tagSearchMore: PropTypes.func,
    profileToggleInterest: PropTypes.func
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
        profileToggleInterest,
        tagSearch,
        tagSearchMore
    }
)(NewIdentityInterestsContainer);
