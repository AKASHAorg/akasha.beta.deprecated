import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NewIdentityInterests } from '../components';
import { selectTagGetEntriesCount } from '../local-flux/selectors';
import { tagSearch, tagSearchMore } from '../local-flux/actions/tag-actions';
import { profileToggleInterest } from '../local-flux/actions/profile-actions';
import { dashboardAddFirst } from '../local-flux/actions/dashboard-actions';


class NewIdentityInterestsContainer extends Component {

    componentWillReceiveProps (nextProps) {
        if (nextProps.firstDashboard === true) {
            const { history } = this.props;
            history.push('/dashboard/first');
        }
    }

    render () {
        const { entriesCount, history, resultsCount, fetchingTags, fetchingMoreTags, query, profileInterests } = this.props;
        const checkMoreTags = resultsCount > entriesCount.size;

        return (
            <NewIdentityInterests
              dashboardAddFirst={this.props.dashboardAddFirst}
              history={history}
              toggleInterest={this.props.profileToggleInterest}
              tagSearch={this.props.tagSearch}
              tagSearchMore={this.props.tagSearchMore}
              entriesCount={entriesCount}
              fetchingMoreTags={fetchingMoreTags}
              fetchingTags={fetchingTags}
              checkMoreTags={checkMoreTags}
              query={query}
              profileInterests={profileInterests}
            />
        );
    }
}

NewIdentityInterestsContainer.propTypes = {
    dashboardAddFirst: PropTypes.func,
    entriesCount: PropTypes.shape(),
    fetchingMoreTags: PropTypes.bool,
    fetchingTags: PropTypes.bool,
    firstDashboard: PropTypes.bool,
    history: PropTypes.shape().isRequired,
    profileInterests: PropTypes.shape(),
    profileToggleInterest: PropTypes.func,
    query: PropTypes.string,
    resultsCount: PropTypes.number,
    tagSearch: PropTypes.func,
    tagSearchMore: PropTypes.func
};

function mapStateToProps (state) {
    return {
        entriesCount: selectTagGetEntriesCount(state),
        fetchingTags: state.searchState.getIn(['flags', 'queryPending']),
        fetchingMoreTags: state.searchState.getIn(['flags', 'moreQueryPending']),
        firstDashboard: state.dashboardState.get('firstDashboard'),
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
)(NewIdentityInterestsContainer);
