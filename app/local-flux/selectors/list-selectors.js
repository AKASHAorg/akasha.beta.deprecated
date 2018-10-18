import { List } from 'immutable';

export const selectListEntryType = (state, id, entryId) => {
    const entryIds = state.listState.getIn(['byId', id, 'entryIds']);
    const entryIndex = entryIds.findIndex(ele => ele.entryId === entryId);
    const entry = entryIds.get(entryIndex);
    return entry.entryType;
};

export const selectListEntries = (state, value, limit) =>
    (state.listState.getIn(['byId', value, 'entryIds']) || new List())
        .slice(0, limit)
        .map((ele) => {
            const { entryId, entryType, authorEthAddress } = ele;
            return { entryId, entryType, author: { ethAddress: authorEthAddress } };
        })
        .toJS();

export const selectListNextEntries = (state, value, limit) => {
    const startIndex = state.listState.getIn(['byId', value, 'startIndex']);
    return state.listState
        .getIn(['byId', value, 'entryIds'])
        .slice(startIndex, startIndex + limit)
        .map(ele => ({ entryId: ele.entryId, author: { ethAddress: ele.authorEthAddress } }))
        .toJS();
};

export const selectLists = (state) => {
    if (state.listState.get('search')) {
        const searchResults = state.listState.get('searchResults');
        return searchResults.map(id => state.listState.getIn(['byId', id]));
    }
    return state.listState.get('byId').toList();
};

export const selectListsAll = state => state.listState.get('byId').toList();

export const selectListsNames = state => state.listState.get('byId').toList().map(list => list.get('name'));

export const selectListsCount = state => state.listState.get('byId').size;

export const selectListSearch = state => state.listState.get('search');

export const selectListById = (state, id) => state.listState.getIn(['byId', id]);
