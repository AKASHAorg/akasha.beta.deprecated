import { List } from 'immutable';
import * as types from '../constants';
import { createReducer } from './create-reducer';
import { DashboardState } from './records';

const initialState = new DashboardState();

const entryIterator = (state, { id }) => {
    if (!id) {
        return state;
    }
    return state.mergeIn(['columnById', id, 'flags'], { fetchingEntries: true });
};

const entryIteratorError = (state, { from }) => {
    if (!from.id) {
        return state;
    }
    return state.mergeIn(['columnById', from.id, 'flags'], { fetchingEntries: false });
};

const entryIteratorSuccess = (state, { data }) => {
    if (!data.id) {
        return state;
    }
    const moreEntries = data.limit === data.collection.length;
    const entryIds = data.collection.map(entry => entry.entryId);
    // the request is made for n + 1 entries to determine if there are more entries left
    // if this is the case, drop the extra entry
    if (moreEntries) {
        entryIds.pop();
    }
    return state.mergeIn(['columnById', data.id], {
        entries: new List(entryIds),
        flags: state.getIn(['columnById', data.id, 'flags']).merge({
            fetchingEntries: false,
            moreEntries
        })
    });
};

const entryMoreIterator = (state, { id }) => {
    if (!id) {
        return state;
    }
    return state.mergeIn(['columnById', id, 'flags'], { fetchingMoreEntries: true });
};

const entryMoreIteratorError = (state, { from }) => {
    if (!from.id) {
        return state;
    }
    return state.mergeIn(['columnById', from.id, 'flags'], { fetchingMoreEntries: false });
};

const entryMoreIteratorSuccess = (state, { data }) => {
    if (!data.id) {
        return state;
    }
    const moreEntries = data.limit === data.collection.length;
    const newIds = data.collection.map(entry => entry.entryId);
    // the request is made for n + 1 entries to determine if there are more entries left
    // if this is the case, drop the extra entry
    if (moreEntries) {
        newIds.pop();
    }
    return state.mergeIn(['columnById', data.id], {
        entries: state.getIn(['columnById', data.id, 'entries']).push(...newIds),
        flags: state.getIn(['columnById', data.id, 'flags']).merge({
            fetchingMoreEntries: false,
            moreEntries
        }),
    });
};

const dashboardState = createReducer(initialState, {

    [types.ENTRY_MORE_NEWEST_ITERATOR]: entryMoreIterator,

    [types.ENTRY_MORE_NEWEST_ITERATOR_ERROR]: entryMoreIteratorError,

    [types.ENTRY_MORE_NEWEST_ITERATOR_SUCCESS]: entryMoreIteratorSuccess,

    [types.ENTRY_MORE_TAG_ITERATOR]: entryMoreIterator,

    [types.ENTRY_MORE_TAG_ITERATOR_ERROR]: entryMoreIteratorError,

    [types.ENTRY_MORE_TAG_ITERATOR_SUCCESS]: entryMoreIteratorSuccess,

    [types.ENTRY_NEWEST_ITERATOR]: entryIterator,

    [types.ENTRY_NEWEST_ITERATOR_ERROR]: entryIteratorError,

    [types.ENTRY_NEWEST_ITERATOR_SUCCESS]: entryIteratorSuccess,

    [types.ENTRY_TAG_ITERATOR]: entryIterator,

    [types.ENTRY_TAG_ITERATOR_ERROR]: entryIteratorError,

    [types.ENTRY_TAG_ITERATOR_SUCCESS]: entryIteratorSuccess,
});

export default dashboardState;
