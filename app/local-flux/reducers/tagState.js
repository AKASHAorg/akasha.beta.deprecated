/* eslint new-cap: [2, {capIsNewExceptions: ["Record"]}] */
import { fromJS, List, Map, Record } from 'immutable';
import * as tagTypes from '../constants/TagConstants';
import * as appTypes from '../constants/AppConstants';
import * as types from '../constants';
import { createReducer } from './create-reducer';

const ErrorRecord = Record({
    code: 0,
    fatal: false,
    message: ''
});

const TagMarginsRecord = Record({
    firstTag: null,
    lastTag: null
});

const initialState = fromJS({
    tagsCount: 0,
    pendingTags: new List(),
    selectedTag: null,
    errors: new List(),
    flags: new Map({
        registerPending: new List(),
        subscribePending: new List()
    }),
    isLoading: false,
    margins: new TagMarginsRecord(),
    moreNewTags: false,
    newestTags: new List(),
    entriesCount: new Map()
});

const subscribeFlagHandler = (state, { error, flags }) => {
    const subscribePending = state.getIn(['flags', 'subscribePending']);
    const index = subscribePending.findIndex(flag =>
        flag.tagName === flags.subscribePending.tagName);
    if (index === -1) {
        return state.merge({
            flags: state.get('flags').merge({
                subscribePending: state.getIn(['flags', 'subscribePending'])
                    .push(flags.subscribePending)
            }),
            errors: error ?
                state.get('errors').push(new ErrorRecord(error)) :
                state.get('errors')
        });
    }
    return state.merge({
        flags: state.get('flags').mergeIn(['subscribePending', index], flags.subscribePending),
        errors: error ?
            state.get('errors').push(new ErrorRecord(error)) :
            state.get('errors')
    });
};

const registerFlagHandler = (state, { error, flags }) => {
    const registerPending = state.getIn(['flags', 'registerPending']);
    const index = registerPending.findIndex(flag =>
        flag.tagName === flags.registerPending.tagName);
    if (error) {
        flags.registerPending.error = error;
    }
    if (index === -1) {
        return state.merge({
            flags: state.get('flags').merge({
                registerPending: state.getIn(['flags', 'registerPending'])
                    .push(flags.registerPending)
            }),
            errors: error ?
                state.get('errors').push(new ErrorRecord(error)) :
                state.get('errors')
        });
    }
    return state.merge({
        flags: state.get('flags').mergeIn(['registerPending', index], flags.registerPending),
        errors: error ?
            state.get('errors').push(new ErrorRecord(error)) :
            state.get('errors')
    });
};

const tagState = createReducer(initialState, {
    [tagTypes.GET_PENDING_TAGS]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [tagTypes.CREATE_PENDING_TAG_SUCCESS]: (state, { tag }) =>
        state.merge({
            pendingTags: state.get('pendingTags').push(tag)
        }),

    [tagTypes.CREATE_PENDING_TAG_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [tagTypes.UPDATE_PENDING_TAG_SUCCESS]: (state, { tag }) => {
        const index = state.get('pendingTags').findIndex(tagObj => tagObj.tag === tag.tag);
        return state.merge({
            pendingTags: state.get('pendingTags').mergeIn([index], tag)
        });
    },

    [tagTypes.UPDATE_PENDING_TAG_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [tagTypes.DELETE_PENDING_TAG_SUCCESS]: (state, { tag }) => {
        const index = state.get('pendingTags').findIndex(tagObj => tagObj.tag === tag);
        return state.merge({
            pendingTags: state.get('pendingTags').delete(index)
        });
    },

    [tagTypes.DELETE_PENDING_TAG_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [tagTypes.GET_PENDING_TAGS_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            pendingTags: new List(data),
            flags: state.get('flags').merge(flags)
        }),

    [tagTypes.GET_PENDING_TAGS_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(error),
            flags: state.get('flags').merge(flags)
        }),

    [tagTypes.REGISTER_TAG]: registerFlagHandler,

    [tagTypes.REGISTER_TAG_SUCCESS]: registerFlagHandler,

    [tagTypes.REGISTER_TAG_ERROR]: registerFlagHandler,

    [tagTypes.GET_SELECTED_TAG]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [tagTypes.GET_SELECTED_TAG_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            selectedTag: (data && data.tagName) || state.get('selectedTag'),
            flags: state.get('flags').merge(flags)
        }),

    [tagTypes.GET_SELECTED_TAG_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
        }),

    [tagTypes.SAVE_TAG]: (state, { tag, flags }) =>
        state.merge({
            selectedTag: tag,
            flags: state.get('flags').merge(flags)
        }),

    [tagTypes.SAVE_TAG_SUCCESS]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [tagTypes.SAVE_TAG_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
        }),

    // [tagTypes.TAG_ITERATOR]: (state, { flags }) =>
    //     state.merge({
    //         flags: state.get('flags').merge(flags)
    //     }),

    // [tagTypes.TAG_ITERATOR_SUCCESS]: (state, { data, flags }) => {
    //     const moreTags = data.limit === data.collection.length;
    //     const newTags = moreTags ?
    //         fromJS(data.collection.slice(0, -1)) :
    //         fromJS(data.collection);
    //     return state.merge({
    //         newestTags: state.get('newestTags').concat(newTags),
    //         moreNewTags: data.limit === data.collection.length,
    //         flags: state.get('flags').merge(flags)
    //     });
    // },

    // [tagTypes.TAG_ITERATOR_ERROR]: (state, { error, flags }) =>
    //     state.merge({
    //         errors: state.get('errors').push(new ErrorRecord(error)),
    //         flags: state.get('flags').merge(flags)
    //     }),

    [tagTypes.CLEAR_NEWEST_TAGS]: state =>
        state.merge({
            newestTags: new List()
        }),

    [tagTypes.SUBSCRIBE_TAG]: subscribeFlagHandler,

    [tagTypes.SUBSCRIBE_TAG_SUCCESS]: subscribeFlagHandler,

    [tagTypes.SUBSCRIBE_TAG_ERROR]: subscribeFlagHandler,

    [tagTypes.UNSUBSCRIBE_TAG]: subscribeFlagHandler,

    [tagTypes.UNSUBSCRIBE_TAG_SUCCESS]: subscribeFlagHandler,

    [tagTypes.UNSUBSCRIBE_TAG_ERROR]: subscribeFlagHandler,

    [appTypes.CLEAN_STORE]: () => initialState,

    // ************ NEW REDUCERS **********************

    [types.TAG_GET_ENTRIES_COUNT_SUCCESS]: (state, { data }) => {
        if (!data.collection) {
            return state;
        }
        let entriesCount = state.get('entriesCount');
        data.collection.forEach((tag) => {
            entriesCount = entriesCount.set(tag.tagName, tag.count);
        });
        return state.set('entriesCount', entriesCount);
    },

    [types.TAG_GET_MARGINS_SUCCESS]: (state, { data }) =>
        state.set('margins', new TagMarginsRecord(data)),

    [types.TAG_SAVE_SUCCESS]: (state, { data }) =>
        state.set('margins', new TagMarginsRecord(data)),

});

export default tagState;
