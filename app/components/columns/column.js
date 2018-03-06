import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import {
    entryMoreNewestIterator, entryMoreProfileIterator, entryProfileIterator, entryListIterator,
    entryMoreListIterator, entryNewestIterator, entryMoreTagIterator, entryTagIterator,
    entryMoreStreamIterator, entryStreamIterator, entryGetShort,
    entryPageShow
} from '../../local-flux/actions/entry-actions';
import {
    profileFollowersIterator, profileFollowingsIterator, profileMoreFollowingsIterator,
    profileMoreFollowersIterator
} from '../../local-flux/actions/profile-actions';
import {
    selectAllPendingClaims, selectAllPendingVotes, selectBaseUrl, selectHideEntrySettings,
    selectLoggedEthAddress, selectProfileEntriesFlags, selectFetchingFollowers, selectFetchingMoreFollowers,
    selectFollowers, selectProfileEntries, selectMoreFollowers, selectFetchingFollowings,
    selectFetchingMoreFollowings, selectFollowings, selectMoreFollowings, selectListsAll
} from '../../local-flux/selectors';
import * as dragItemTypes from '../../constants/drag-item-types';
import ColManager from './col-manager';
import ColumnHeader from './column-header';
import dropBox from './column-dropBox';
import getColumnPropsByType from './column-props-by-type';

const Column = ({
    onBeginDrag, onEndDrag, isColumnDragging, column, baseWidth,
    type, entries, readOnly, ...other
}) => {
    const passedProps = getColumnPropsByType({
        column,
        baseWidth,
        type,
        entries,
        contextId: column ? column.id : '',
        onRetry: (data) => {
            other.entryGetShort({ ...data });
        },
        iconType: 'entries',
        title: column ? column.value : null,
        ...other
    });
    return (
      <ColumnHeader
        readOnly={readOnly}
        column={passedProps.column}
        columnIndex={other.columnIndex}
        onRefresh={passedProps.onColumnRefresh}
        onBeginDrag={onBeginDrag}
        onEndDrag={onEndDrag}
        isColumnDragging={isColumnDragging}
        connectDropTarget={other.connectDropTarget}
        iconType={passedProps.iconType}
        title={passedProps.title}
        draggable={other.draggable}
        noMenu={passedProps.noMenu}
      >
        <ColManager {...passedProps} />
      </ColumnHeader>
    );
};

Column.propTypes = {
    baseWidth: PropTypes.number,
    column: PropTypes.shape(),
    ethAddress: PropTypes.string,
    type: PropTypes.string,
    entries: PropTypes.shape(),
    onBeginDrag: PropTypes.func,
    onEndDrag: PropTypes.func,
    isColumnDragging: PropTypes.func,
    readOnly: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
    const { ethAddress } = ownProps;
    const { fetchingEntries, fetchingMoreEntries, moreEntries } =
        selectProfileEntriesFlags(state, ethAddress);
    return {
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
        entries: state.entryState.get('byId'),
        profileEntriesList: selectProfileEntries(state, ethAddress),
        fetchingEntries,
        fetchingMoreEntries,
        moreEntries,
        fetchingFollowers: selectFetchingFollowers(state, ethAddress),
        fetchingMoreFollowers: selectFetchingMoreFollowers(state, ethAddress),
        followers: selectFollowers(state, ethAddress),
        moreFollowers: selectMoreFollowers(state, ethAddress),
        fetchingFollowings: selectFetchingFollowings(state, ethAddress),
        fetchingMoreFollowings: selectFetchingMoreFollowings(state, ethAddress),
        followings: selectFollowings(state, ethAddress),
        moreFollowings: selectMoreFollowings(state, ethAddress),
        lists: selectListsAll(state)
    };
};

const mapDispatchToProps = {
    entryNewestIterator,
    entryMoreNewestIterator,
    entryProfileIterator,
    entryMoreProfileIterator,
    entryListIterator,
    entryMoreListIterator,
    entryMoreTagIterator,
    entryTagIterator,
    entryMoreStreamIterator,
    entryStreamIterator,
    entryGetShort,
    profileFollowersIterator,
    profileMoreFollowersIterator,
    profileFollowingsIterator,
    profileMoreFollowingsIterator,
    entryPageShow,
};

export default connect(mapStateToProps, mapDispatchToProps)(DropTarget(
    dragItemTypes.COLUMN,
    dropBox,
    connectR => ({
        connectDropTarget: connectR.dropTarget(),
    })
)(Column));
