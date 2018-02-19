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
import ColManager from './col-manager';
import ColumnHeader from './column-header';

const dropBox = {
    drop (props) {
        // console.log('dropped at', props.column);
    },
    hover (props, monitor) {
        // console.log('hovered', props, monitor.isOver({ shallow: true }));
        const draggedItem = monitor.getItem();
        const hoveredColumn = document.getElementById(props.column.get('id'));
        const colSize = hoveredColumn.getBoundingClientRect();
        const hoverMiddleX = (colSize.right - colSize.left) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientX = clientOffset.x - colSize.left;
        const dragIndex = draggedItem.columnIndex;
        const hoverIndex = props.columnIndex;
        // console.log(draggedItem, hoverIndex, 'dragged, hover');
        if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
            return;
        }
        if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
            return;
        }
        props.onNeighbourHover(dragIndex, hoverIndex);
        monitor.getItem().columnIndex = hoverIndex;
    }
};

const Column = ({
    onBeginDrag, onEndDrag, isColumnDragging, column, baseWidth,
    ethAddress, type, entries, ...other
}) => {
    let props = {
        column,
        entries,
        baseWidth,
        onRetry: () => { console.error('implement retry'); },
        ...other
    };
    switch (type) {
        case columnTypes.latest:
            props = {
                ...props,
                onItemRequest: other.entryNewestIterator,
                onItemMoreRequest: other.entryMoreNewestIterator,
            };
            break;
        case columnTypes.list:
            props = {
                ...props,
                onItemRequest: other.entryListIterator,
                onItemMoreRequest: other.entryMoreListIterator,
            };
            break;
        case columnTypes.tag:
            props = {
                ...props,
                onItemRequest: other.entryTagIterator,
                onItemMoreRequest: other.entryMoreTagIterator,
            };
            break;
        case columnTypes.stream:
            props = {
                ...props,
                onItemRequest: other.entryStreamIterator,
                onItemMoreRequest: other.entryMoreStreamIterator,
            };
            break;
        case columnTypes.profile:
        case columnTypes.profileEntries:
            props = {
                ...props,
                onItemRequest: other.entryProfileIterator,
                onItemMoreRequest: other.entryMoreProfileIterator
            };
            break;
        case columnTypes.profileFollowers:
            props = {
                ...props,
                onItemRequest: other.profileFollowersIterator,
                onItemMoreRequest: other.profileMoreFollowersIterator
            };
            break;
        case columnTypes.profileFollowings:
            props = {
                ...props,
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
        onRefresh={() => console.error('implement refresh')}
        onBeginDrag={onBeginDrag}
        onEndDrag={onEndDrag}
        isColumnDragging={isColumnDragging}
        connectDropTarget={other.connectDropTarget}
      >
        {!other.inDragMode &&
          <ColManager {...props} />
        }
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
