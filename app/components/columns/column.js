import PropTypes from 'prop-types';
import React from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import * as columnTypes from '../../constants/columns';
// import { LatestColumn, ListColumn, ProfileColumn, ProfileEntriesColumn, ProfileFollowersColumn,
//     ProfileFollowingsColumn, StreamColumn, TagColumn } from '../';
import { entryMoreNewestIterator, entryMoreProfileIterator, entryProfileIterator, entryListIterator,
    entryMoreListIterator, entryNewestIterator, entryMoreTagIterator, entryTagIterator,
    entryMoreStreamIterator, entryStreamIterator,
    entryPageShow } from '../../local-flux/actions/entry-actions';
import { profileFollowersIterator, profileFollowingsIterator, profileMoreFollowingsIterator,
    profileMoreFollowersIterator } from '../../local-flux/actions/profile-actions';
import { selectAllPendingClaims, selectAllPendingVotes, selectBaseUrl, selectHideEntrySettings,
    selectLoggedEthAddress } from '../../local-flux/selectors';
import { dashboardMessages, profileMessages } from '../../locale-data/messages';
import ColManager from './col-manager';
import ColumnHeader from './column-header';

const dropBox = {
    drop (props) {
        // console.log('dropped at', props.column);
    },
    /* eslint-disable max-statements */
    hover (props, monitor) {
        // console.log('hovered', props, monitor.isOver({ shallow: true }));
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
            // monitor.getItem().columnIndex = hoverIndex;
        }
    }
};

const Column = ({
    onBeginDrag, onEndDrag, isColumnDragging, column, baseWidth,
    ethAddress, type, entries, ...other
}) => {
    let passedProps = {
        column,
        entries,
        baseWidth,
        onRetry: () => { console.error('implement retry'); },
        iconType: 'entries',
        title: column.get('value'),
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
                title: other.intl.formatMessage(profileMessages.entries),
                iconType: 'profile',
                onItemRequest: other.entryProfileIterator,
                onItemMoreRequest: other.entryMoreProfileIterator
            };
            break;
        case columnTypes.profileEntries:
            passedProps = {
                ...passedProps,
                onItemRequest: other.entryProfileIterator,
                onItemMoreRequest: other.entryMoreProfileIterator
            };
            break;
        case columnTypes.profileFollowers:
            passedProps = {
                ...passedProps,
                title: other.intl.formatMessage(profileMessages.followers),
                onItemRequest: other.profileFollowersIterator,
                onItemMoreRequest: other.profileMoreFollowersIterator
            };
            break;
        case columnTypes.profileFollowings:
            passedProps = {
                ...passedProps,
                onItemRequest: other.profileFollowingsIterator,
                onItemMoreRequest: other.profileMoreFollowingsIterator
            };
            break;
        default:
            break;
    }

    return (
      <ColumnHeader
        readonly
        column={column}
        columnIndex={other.columnIndex}
        onRefresh={() => console.error('implement refresh')}
        onBeginDrag={onBeginDrag}
        onEndDrag={onEndDrag}
        isColumnDragging={isColumnDragging}
        connectDropTarget={other.connectDropTarget}
        iconType={passedProps.iconType}
        title={passedProps.title}
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
    entryProfileIterator,
    entryMoreProfileIterator,
    entryListIterator,
    entryMoreListIterator,
    entryMoreTagIterator,
    entryTagIterator,
    entryMoreStreamIterator,
    entryStreamIterator,
    profileFollowersIterator,
    profileMoreFollowersIterator,
    profileFollowingsIterator,
    profileMoreFollowingsIterator,
    entryPageShow,
};

export default connect(mapStateToProps, mapDispatchToProps)(DropTarget('COLUMN', dropBox, connectR => ({
    connectDropTarget: connectR.dropTarget(),
}))(Column));
