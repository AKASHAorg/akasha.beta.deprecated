// @flow
import { List } from 'immutable';
import { createSelector } from 'reselect';
/*::
    type ListEntryTypeProps = {
        listId: string,
        entryId?: string
    }
    type ListEntriesProps = {
        listId: string,
        limit: number
    }
 */

export const selectListById = (state /*: Object */, props /*: ListEntryTypeProps */) =>
    state.listState.getIn(['byId', props.listId]);
export const selectListEntryIds = (state /*: Object */, props /*: ListEntryTypeProps */) =>
    selectListById(state, props).get('entryIds');
export const selectListEntryIndex = (state /*: Object */, props /*: ListEntryTypeProps */) =>
    selectListEntryIds(state, props).findIndex(listEntry => listEntry.entryId === props.entryId);
export const selectLists = (state /*: Object */) => state.listState.get('byId').toList();
export const selectListsNames = (state /*: Object */) => selectLists(state).map(list => list.get('name'));
export const selectListsCount = (state /*: Object */) => selectLists(state).size;
export const selectListSearchTerm = (state /*: Object */) => state.listState.get('search');
export const selectListSearchResults = (state /*: Object */) => state.listState.get('searchResults');

export const getListEntryType = createSelector(
    [selectListEntryIds, selectListEntryIndex],
    (entryIds /*: Object */, entryIndex /*: Number */) => entryIds.get(entryIndex).entryType
);

export const getListEntries = (state /*: Object */, props /*: ListEntriesProps */) => {
    const listEntries = selectListEntryIds(state, { listId: props.listId }) || new List();
    return listEntries.slice(0, props.limit).map(entry => {
        const { entryId, entryType, authorEthAddress } = entry;
        return { entryId, entryType, author: { ethAddress: authorEthAddress } };
    });
};

export const getListNextEntries = createSelector(
    [selectListById, (state /*: Object*/, props /*: ListEntriesProps */) => props.limit],
    (list, limit) => {
        const startIndex = list.get('startIndex');
        const entryIds = list.get('entryIds');
        return entryIds
            .slice(startIndex, startIndex + limit)
            .map(entry => ({ entryId: entry.entryId, author: { ethAddress: entry.authorEthAddress } }));
    }
);

export const getLists = createSelector(
    [selectListSearchTerm, selectListSearchResults, selectLists, (state /*: Object */) => state],
    (searchTerm, searchResults, lists, state) => {
        if (searchTerm) {
            searchResults.map((listId /*: string */) => selectListById(state, { listId }));
        }
        return lists;
    }
);
