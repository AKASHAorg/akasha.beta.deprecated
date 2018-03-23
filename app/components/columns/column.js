import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import { toggleOutsideNavigation } from '../../local-flux/actions/app-actions';
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
import { searchProfiles, searchTags, searchResetResults } from '../../local-flux/actions/search-actions';
import {
    selectAllPendingClaims, selectAllPendingVotes, selectBaseUrl, selectHideEntrySettings,
    selectLoggedEthAddress, selectProfileEntriesFlags, selectFetchingFollowers, selectFetchingMoreFollowers,
    selectFollowers, selectProfileEntries, selectMoreFollowers, selectFetchingFollowings,
    selectFetchingMoreFollowings, selectFollowings, selectMoreFollowings, selectListsAll,
    selectTagSearchResults, selectProfileSearchResults, selectProfileExists, selectTagExists,
} from '../../local-flux/selectors';
import * as dragItemTypes from '../../constants/drag-item-types';
import ColManager from './col-manager';
import ColumnHeader from './column-header';
import { DataLoader } from '../';
import dropBox from './column-dropBox';
import columnProps from './column-props-by-type';
import ColumnEmptyPlaceholder from './column-empty-placeholder';

const Column = ({ onBeginDrag, onEndDrag, isColumnDragging, baseWidth, type, ...other }) => {
    const passedProps = columnProps[type]({
        baseWidth,
        type,
        onRetry: (data) => {
            other.entryGetShort({ ...data });
        },
        iconType: 'entries',
        ...other,
        pendingEntries: other.pendingEntries.get(other.column.id),
    });
    return (
      <ColumnHeader
        readOnly={passedProps.readOnly}
        column={passedProps.column}
        columnIndex={passedProps.columnIndex}
        onRefresh={passedProps.onColumnRefresh}
        onBeginDrag={onBeginDrag}
        onEndDrag={onEndDrag}
        isColumnDragging={isColumnDragging}
        connectDropTarget={passedProps.connectDropTarget}
        iconType={passedProps.iconType}
        title={passedProps.title}
        draggable={passedProps.draggable}
        noMenu={passedProps.noMenu}
        dataSource={passedProps.dataSource}
        onSearch={passedProps.onSearch}
      >
        {passedProps.fetching && passedProps.column.entriesList.size === 0 &&
          <DataLoader
            flag
            timeout={500}
          />
        }
        {(!passedProps.column || passedProps.column.entriesList.size === 0) && !passedProps.fetching &&
          <ColumnEmptyPlaceholder
            type={type}
            intl={passedProps.intl}
          />
        }
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
        column: state.dashboardState.getIn(['columnById', ownProps.columnId]),
        drafts: state.draftState.get('drafts'),
        fetchingEntryBalance: state.entryState.getIn(['flags', 'fetchingEntryBalance']),
        hideEntrySettings: selectHideEntrySettings(state),
        loggedEthAddress: selectLoggedEthAddress(state),
        pendingClaims: selectAllPendingClaims(state),
        pendingEntries: state.entryState.getIn(['flags', 'pendingEntries']),
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
        lists: selectListsAll(state),
        tagSearchResults: selectTagSearchResults(state),
        profileSearchResults: selectProfileSearchResults(state),
        profileExists: selectProfileExists(state),
        tagExists: selectTagExists(state)
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
    searchProfiles,
    searchTags,
    searchResetResults,
    toggleOutsideNavigation
};

export default connect(mapStateToProps, mapDispatchToProps)(DropTarget(
    dragItemTypes.COLUMN,
    dropBox,
    connectR => ({
        connectDropTarget: connectR.dropTarget(),
    })
)(Column));
