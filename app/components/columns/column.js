import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import * as columnTypes from '../../constants/columns';
import { entryMoreNewestIterator, entryMoreProfileIterator, entryProfileIterator, entryListIterator,
    entryMoreListIterator, entryNewestIterator, entryMoreTagIterator, entryTagIterator,
    entryMoreStreamIterator, entryStreamIterator, entryGetShort,
    entryPageShow } from '../../local-flux/actions/entry-actions';
import { profileFollowersIterator, profileFollowingsIterator, profileMoreFollowingsIterator,
    profileMoreFollowersIterator } from '../../local-flux/actions/profile-actions';
import { selectAllPendingClaims, selectAllPendingVotes, selectBaseUrl, selectHideEntrySettings,
    selectLoggedEthAddress, selectProfileEntriesFlags, selectFetchingFollowers, selectFetchingMoreFollowers,
    selectFollowers, selectProfileEntries, selectMoreFollowers, selectFetchingFollowings,
    selectFetchingMoreFollowings, selectFollowings, selectMoreFollowings } from '../../local-flux/selectors';
import { dashboardMessages, profileMessages } from '../../locale-data/messages';
import ColManager from './col-manager';
import ColumnHeader from './column-header';

const dropBox = {
    /* eslint-disable max-statements */
    hover (props, monitor) {
        const draggedItem = monitor.getItem();
        const draggedItemId = draggedItem.columnId;
        const hoverItemId = props.column.get('id');
        if (draggedItemId !== hoverItemId) {
            const hoveredColumn = document.getElementById(props.column.get('id'));
            const colSize = hoveredColumn.getBoundingClientRect();
            const hoverMiddleX = (colSize.right - colSize.left) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientX = clientOffset.x - colSize.left;
            const dragIndex = draggedItem.columnIndex;
            let hoverIndex = props.columnIndex;
            if (dragIndex < hoverIndex) {
                if (hoverClientX < hoverMiddleX) {
                    hoverIndex -= 1;
                }
            }
            if (dragIndex > hoverIndex) {
                if (hoverClientX > hoverMiddleX) {
                    hoverIndex += 1;
                }
            }
            props.onNeighbourHover(dragIndex, hoverIndex);
        }
    }
};
/* eslint-disable complexity */
const Column = ({
    onBeginDrag, onEndDrag, isColumnDragging, column, baseWidth,
    type, entries, ...other
}) => {
    let passedProps = {
        column,
        entries,
        baseWidth,
        contextId: column ? column.id : '',
        onRetry: (data) => {
            other.entryGetShort({ ...data });
        },
        iconType: 'entries',
        title: column ? column.value : null,
        ...other
    };
    switch (type) {
        case columnTypes.latest:
            passedProps = {
                ...passedProps,
                title: other.intl.formatMessage(dashboardMessages.latest),
                onItemRequest: other.entryNewestIterator,
                onItemMoreRequest: other.entryMoreNewestIterator,
            };
            break;
        case columnTypes.list:
            passedProps = {
                ...passedProps,
                onItemRequest: other.entryListIterator,
                onItemMoreRequest: other.entryMoreListIterator,
            };
            break;
        case columnTypes.tag:
            passedProps = {
                ...passedProps,
                iconType: 'tag',
                onItemRequest: other.entryTagIterator,
                onItemMoreRequest: other.entryMoreTagIterator,
            };
            break;
        case columnTypes.stream:
            passedProps = {
                ...passedProps,
                onItemRequest: other.entryStreamIterator,
                onItemMoreRequest: other.entryMoreStreamIterator,
            };
            break;
        case columnTypes.profile:
            passedProps = {
                ...passedProps,
                title: other.intl.formatMessage(profileMessages.entries),
                iconType: 'profile',
                onItemRequest: other.entryProfileIterator,
                onItemMoreRequest: other.entryMoreProfileIterator
            };
            break;
        case columnTypes.profileEntries:
            passedProps = {
                ...passedProps,
                column: {
                    id: 'profileEntries',
                    entriesList: other.profileEntriesList,
                    ethAddress: other.ethAddress
                },
                contextId: 'profileEntries',
                title: other.intl.formatMessage(profileMessages.entries),
                onItemRequest: other.entryProfileIterator,
                onItemMoreRequest: other.entryMoreProfileIterator
            };
            break;
        case columnTypes.profileFollowers:
            passedProps = {
                ...passedProps,
                column: {
                    id: 'profileFollowers',
                    entriesList: other.followers,
                    ethAddress: other.ethAddress,
                    context: 'profilePageFollowers'
                },
                title: other.intl.formatMessage(profileMessages.followers),
                onItemRequest: other.profileFollowersIterator,
                onItemMoreRequest: other.profileMoreFollowersIterator
            };
            break;
        case columnTypes.profileFollowings:
            passedProps = {
                ...passedProps,
                column: {
                    id: 'profileFollowings',
                    entriesList: other.followings,
                    ethAddress: other.ethAddress
                },
                title: other.intl.formatMessage(profileMessages.followings),
                onItemRequest: other.profileFollowingsIterator,
                onItemMoreRequest: other.profileMoreFollowingsIterator
            };
            break;
        default:
            break;
    }

    return (
      <ColumnHeader
        readOnly={other.readOnly}
        column={column}
        columnIndex={other.columnIndex}
        onRefresh={() => console.error('implement refresh')}
        onBeginDrag={onBeginDrag}
        onEndDrag={onEndDrag}
        isColumnDragging={isColumnDragging}
        connectDropTarget={other.connectDropTarget}
        iconType={passedProps.iconType}
        title={passedProps.title}
        draggable={other.draggable}
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

export default connect(mapStateToProps, mapDispatchToProps)(DropTarget('COLUMN', dropBox, connectR => ({
    connectDropTarget: connectR.dropTarget(),
}))(Column));
