import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import {
    entryMoreNewestIterator, entryMoreProfileIterator, entryProfileIterator, entryListIterator,
    entryMoreListIterator, entryNewestIterator, entryMoreTagIterator, entryTagIterator,
    entryMoreStreamIterator, entryStreamIterator, entryGetShort,
} from '../../local-flux/actions/entry-actions';
import { dashboardResetColumnEntries } from '../../local-flux/actions/dashboard-actions';
import {
    profileCommentsIterator, profileFollowersIterator, profileFollowingsIterator,
    profileMoreCommentsIterator, profileMoreFollowingsIterator, profileMoreFollowersIterator
} from '../../local-flux/actions/profile-actions';
import { searchProfiles, searchTags } from '../../local-flux/actions/search-actions';
import { ColumnRecord } from '../../local-flux/reducers/state-models/dashboard-state-model';
import { dashboardSelectors, entrySelectors, listSelectors, 
    searchSelectors } from '../../local-flux/selectors';
import * as dragItemTypes from '../../constants/drag-item-types';
import ColManager from './col-manager';
import ColumnHeader from './column-header';
import { DataLoader } from '../';
import dropBox from './column-dropBox';
import columnProps from './column-props-by-type';
import ColumnEmptyPlaceholder from './column-empty-placeholder';

const Column = ({ onBeginDrag, onEndDrag, isColumnDragging, pendingEntries, type, ...other }) => {
    const passedProps = columnProps[type]({
        type,
        onRetry: other.entryGetShort,
        iconType: 'entries',
        pendingEntries: other.column ?
            pendingEntries.get(other.column.id) :
            pendingEntries.get(type),
        ...other,
    });
    const fetchingItems = passedProps.column.flags.fetchingItems;
    return (
      <ColumnHeader
        readOnly={passedProps.readOnly}
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
        dataSource={passedProps.dataSource}
        onSearch={passedProps.onSearch}
      >
        {fetchingItems && passedProps.column.itemsList.size === 0 &&
          <DataLoader
            flag
            timeout={500}
            className="column__data-loader"
          />
        }
        {(!passedProps.column || passedProps.column.itemsList.size === 0) && !fetchingItems &&
          <ColumnEmptyPlaceholder
            type={type}
            intl={other.intl}
          />
        }
        <ColManager
            {...passedProps}
            large={other.large}
            onSizeChange={other.onSizeChange}
            intl={other.intl}
        />
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
    pendingEntries: PropTypes.shape(),
    readOnly: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
    const { columnId } = ownProps;
    return {
        column: dashboardSelectors.selectColumnById(state, columnId) || new ColumnRecord({ id: columnId}),
        pendingEntries: entrySelectors.selectPendingEntriesFlags(state),
        lists: listSelectors.selectLists(state),
        tagSearchResults: searchSelectors.selectTagSearchResults(state),
        profileSearchResults: searchSelectors.selectProfileSearchResults(state),
    };
};

const mapDispatchToProps = {
    dashboardResetColumnEntries,
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
    profileCommentsIterator,
    profileFollowersIterator,
    profileMoreCommentsIterator,
    profileMoreFollowersIterator,
    profileFollowingsIterator,
    profileMoreFollowingsIterator,
    searchProfiles,
    searchTags,
};

export default connect(mapStateToProps, mapDispatchToProps)(DropTarget(
    dragItemTypes.COLUMN,
    dropBox,
    connectR => ({
        connectDropTarget: connectR.dropTarget(),
    })
)(Column));
