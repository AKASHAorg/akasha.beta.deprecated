import { List, Map, Record } from 'immutable';

// const Flags = Record({
//     fetchingLists: false,
//     searching: false,
//     updatingLists: false
// });

export const ListRecord = Record({
    account: null,
    description: null,
    entryIds: new List(),
    id: null,
    moreEntries: false,
    name: null,
    startIndex: 0,
    timestamp: null,
});

const ListState = Record({
    byId: new Map(),
    entryLists: new Map(),
    // flags: new Flags(),
    search: '',
    searchResults: new List()
});

export default class ListStateModel extends ListState {
    createListRecord (record) {
        const list = Object.assign({}, record);
        if (list.entryIds && !List.isList(list.entryIds)) {
            list.entryIds = new List(list.entryIds);
        }
        return new ListRecord(list);
    }
}
