/* eslint new-cap: [2, {capIsNewExceptions: ["Record"]}] */
import { fromJS, List, Map, Record } from 'immutable';
import * as types from '../constants/TagConstants';
import * as entryTypes from '../constants/EntryConstants';
import { createReducer } from './create-reducer';

const ErrorRecord = Record({
    code: 0,
    fatal: false,
    message: ''
});

const initialState = fromJS({
    tagsCount: 0,
    pendingTags: new List(),
    selectedTag: null,
    errors: new List(),
    flags: new Map(),
    newestTags: new List(),
    moreNewTags: false,
    isLoading: false
});

const subscribeFlagHandler = (state, { flags }) => {
    const subscribePending = state.getIn(['flags', 'subscribePending']);
    if (subscribePending === undefined) {
        return state.merge({
            flags: state.get('flags')
                .set('subscribePending', new List([flags.subscribePending]))
        });
    }
    const index = subscribePending.findIndex(flag =>
        flag.tagName === flags.subscribePending.tagName);
    if (index === -1) {
        return state.merge({
            flags: state.get('flags').merge({
                subscribePending: state.getIn(['flags', 'subscribePending'])
                    .push(flags.subscribePending)
            })
        });
    }
    return state.merge({
        flags: state.get('flags').mergeIn(['subscribePending', index], flags.subscribePending)
    });
};

const subscribeErrorFlagHandler = (state, { error, flags }) => {
    const subscribePending = state.getIn(['flags', 'subscribePending']);
    if (subscribePending === undefined) {
        return state.merge({
            flags: state.get('flags')
                .set('subscribePending', new List([flags.subscribePending])),
            errors: state.get('errors').push(new ErrorRecord(error))
        });
    }
    const index = subscribePending.findIndex(flag =>
        flag.tagName === flags.subscribePending.tagName);
    if (index === -1) {
        return state.merge({
            flags: state.get('flags').merge({
                subscribePending: state.getIn(['flags', 'subscribePending'])
                    .push(flags.subscribePending)
            }),
            errors: state.get('errors').push(new ErrorRecord(error))
        });
    }
    return state.merge({
        flags: state.get('flags').mergeIn(['subscribePending', index], flags.subscribePending),
        errors: state.get('errors').push(new ErrorRecord(error))
    });
}

const tagState = createReducer(initialState, {
    [types.GET_PENDING_TAGS]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.CREATE_PENDING_TAG_SUCCESS]: (state, { tag }) =>
        state.merge({
            pendingTags: state.get('pendingTags').push(tag)
        }),

    [types.CREATE_PENDING_TAG_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.UPDATE_PENDING_TAG_SUCCESS]: (state, { tag }) => {
        const index = state.get('pendingTags').findIndex(tagObj => tagObj.tag === tag.tag);
        return state.merge({
            pendingTags: state.get('pendingTags').mergeIn([index], tag)
        });
    },

    [types.UPDATE_PENDING_TAG_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.DELETE_PENDING_TAG_SUCCESS]: (state, { tag }) => {
        const index = state.get('pendingTags').findIndex(tagObj => tagObj.tag === tag);
        return state.merge({
            pendingTags: state.get('pendingTags').delete(index)
        });
    },

    [types.DELETE_PENDING_TAG_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.GET_PENDING_TAGS_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            pendingTags: new List(data),
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_PENDING_TAGS_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(error),
            flags: state.get('flags').merge(flags)
        }),

    // [types.CREATE_TAG_SUCCESS]: (state, { data }) => {
    //     const pendingTagIndex = state.get('pendingTags').findIndex(tagObj => tagObj.tag === data.tag);
    //     console.log(pendingTagIndex, 'pendingTagIndex');
    //     return state.setIn(['pendingTags', pendingTagIndex, 'tx'], data.tx);
    //     // state.merge({
    //     //     pendingTags: state.get('pendingTags').setIn([pendingTagIndex, 'tx'], data.tx)
    //     // });
    // },

    [types.CREATE_TAG_ERROR]: (state, { error }) => {
        const tagName = error.from;
        const pendingTagIndex = state.get('pendingTags').findIndex(tagObj => tagObj.tag === tagName);
        return state.merge({
            pendingTags: state.get('pendingTags').mergeIn([pendingTagIndex], { error })
        });
    },

    [types.GET_SELECTED_TAG]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_SELECTED_TAG_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            selectedTag: data.tagName || state.get('selectedTag'),
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_SELECTED_TAG_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
        }),

    [types.SAVE_TAG]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.SAVE_TAG_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            selectedTag: data ? data.tagName : null,
            flags: state.get('flags').merge(flags)
        }),

    [types.SAVE_TAG_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
        }),

    [types.TAG_ITERATOR]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.TAG_ITERATOR_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            newestTags: state.get('newestTags').concat(fromJS(data.collection.slice(0, -1))),
            moreNewTags: data.limit === data.collection.length,
            flags: state.get('flags').merge(flags)
        }),

    [types.TAG_ITERATOR_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
        }),

    [types.CLEAR_NEWEST_TAGS]: state =>
        state.merge({
            newestTags: new List()
        }),

    [types.CLEAR_SELECTED_TAG]: state =>
        state.merge({
            selectedTag: null
        }),

    [entryTypes.GET_ENTRIES_STREAM_SUCCESS]: (state, { data }) => {
        if (state.get('selectedTag') === null) {
            return state.merge({
                selectedTag: data.tags[0].tagName
            });
        }
        return state;
    },

    [types.FOLLOW_PROFILE]: (state, { flags }) => {
        const followPending = state.getIn(['flags', 'followPending']);
        if (followPending === undefined) {
            return state.merge({
                flags: state.get('flags').set('followPending', new List([flags.followPending]))
            });
        }
        const index = followPending.findIndex(flag =>
            flag.akashaId === flags.followPending.akashaId
        );
        if (index === -1) {
            return state.merge({
                flags: state.get('flags').merge({
                    followPending: state.getIn(['flags', 'followPending']).push(flags.followPending)
                })
            });
        }
        return state.merge({
            flags: state.get('flags').mergeIn(['followPending', index], flags.followPending)
        });
    },

    [types.SUBSCRIBE_TAG]: subscribeFlagHandler,

    [types.SUBSCRIBE_TAG_SUCCESS]: subscribeFlagHandler,

    [types.SUBSCRIBE_TAG_ERROR]: subscribeErrorFlagHandler,

    [types.UNSUBSCRIBE_TAG]: subscribeFlagHandler,

    [types.UNSUBSCRIBE_TAG_SUCCESS]: subscribeFlagHandler,

    [types.UNSUBSCRIBE_TAG_ERROR]: subscribeErrorFlagHandler
});

export default tagState;
