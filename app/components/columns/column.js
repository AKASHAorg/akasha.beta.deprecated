import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import * as columnTypes from '../../constants/columns';
// import { LatestColumn, ListColumn, ProfileColumn, ProfileEntriesColumn, ProfileFollowersColumn,
//     ProfileFollowingsColumn, StreamColumn, TagColumn } from '../';
import { entryMoreNewestIterator,
    entryNewestIterator, entryPageShow } from '../../local-flux/actions/entry-actions';
import { selectAllPendingClaims, selectAllPendingVotes, selectBaseUrl, selectHideEntrySettings,
    selectLoggedEthAddress } from '../../local-flux/selectors';
import ColManager from './col-manager';

const Column = ({ column, baseWidth, ethAddress, type, entries, ...other }) => {
    let component;
    const props = {
        column,
        entries,
        baseWidth,
        onItemRequest: other.entryNewestIterator,
        onItemMoreRequest: other.entryMoreNewestIterator,
        onRetry: () => { console.error('implement retry'); },
        ...other
    };
    component = <ColManager {...props} />;
    // switch (type) {
    //     case columnTypes.latest:
    //         component = <LatestColumn {...props} />;
    //         break;
    //     case columnTypes.list:
    //         component = <ListColumn {...props} />;
    //         break;
    //     case columnTypes.tag:
    //         component = <TagColumn {...props} />;
    //         break;
    //     case columnTypes.stream:
    //         component = <StreamColumn {...props} />;
    //         break;
    //     case columnTypes.profile:
    //         component = <ProfileColumn {...props} />;
    //         break;
    //     case columnTypes.profileEntries:
    //         component = <ProfileEntriesColumn ethAddress={ethAddress} />;
    //         break;
    //     case columnTypes.profileFollowers:
    //         component = <ProfileFollowersColumn ethAddress={ethAddress} />;
    //         break;
    //     case columnTypes.profileFollowings:
    //         component = <ProfileFollowingsColumn ethAddress={ethAddress} />;
    //         break;
    //     default:
    //         break;
    // }

    return (
      <div className="column__wrapper">
        {component}
      </div>
    );
};

Column.propTypes = {
    baseWidth: PropTypes.number,
    column: PropTypes.shape(),
    ethAddress: PropTypes.string,
    type: PropTypes.string,
    entries: PropTypes.shape(),
};

const mapStateToProps = (state, ownProps) => ({
    baseUrl: selectBaseUrl(state),
    blockNr: state.externalProcState.getIn(['geth', 'status', 'blockNr']),
    canClaimPending: state.entryState.getIn(['flags', 'canClaimPending']),
    drafts: state.draftState.get('drafts'),
    fetchingEntryBalance: state.entryState.getIn(['flags', 'fetchingEntryBalance']),
    hideEntrySettings: selectHideEntrySettings(state),
    loggedEthAddress: selectLoggedEthAddress(state),
    pendingClaims: selectAllPendingClaims(state),
    pendingEntries: state.entryState.getIn(['flags', 'pendingEntries', ownProps.contextId]),
    pendingVotes: selectAllPendingVotes(state),
    profiles: state.profileState.get('byEthAddress'),
    searchQuery: state.searchState.get('query'),
    entries: state.entryState.get('byId')
});

const mapDispatchToProps = {
    entryNewestIterator,
    entryMoreNewestIterator,
    entryPageShow,
};

export default connect(mapStateToProps, mapDispatchToProps)(Column);
