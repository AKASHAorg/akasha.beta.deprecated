import { List, Map, Record } from 'immutable';

const TagRecord = Record({
    entriesCount: new Map(),
    exists: new Map(),
    // flags: new Map({
    //     existsPending: new Map(),
    //     registerPending: new List(),
    //     searchPending: false
    // }),
    moreNewTags: false,
    searchQuery: null,
    searchResults: new List()
});

export default class TagStateModel extends TagRecord {

}