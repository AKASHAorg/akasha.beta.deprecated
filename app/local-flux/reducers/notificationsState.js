import { fromJS } from 'immutable';
import * as types from '../constants/NotificationsConstants';
import * as appTypes from '../constants/AppConstants';
import { createReducer } from './create-reducer';

const initialState = fromJS({
    notifFeed: [],
    youFeed: [],
    youNrFeed: 0,
    hasFeed: false
});
const maxFeed = 64;

const notificationsState = createReducer(initialState, {
    [types.FEED_SUBSCRIPTION_NOTIF]: (state, action) => {
        let updatedFeed;
        let feedObj;
        // const hasFeed = !state.get('hasFeed');
        if (action.payload.hasOwnProperty('running')) {
            return state;
        }
        const notifIndex = action.payload.type === 'publish' ?
            state.get('notifFeed').findIndex(notif =>
                notif.type === 'publish' && notif.entry &&
                notif.entry.entryId === action.payload.entry.entryId
            ) :
            -1;
        if (state.get('notifFeed').size > maxFeed && notifIndex === -1) {
            updatedFeed = state.get('notifFeed').pop();
            feedObj = { notifFeed: updatedFeed.unshift(action.payload), hasFeed: true };
        } else {
            const shouldAddTag = notifIndex !== -1 &&
                state.getIn(['notifFeed', notifIndex, 'tag']).indexOf(action.payload.tag) === -1;
            feedObj = {
                notifFeed: !shouldAddTag ?
                    state.get('notifFeed').unshift(action.payload) :
                    state.get('notifFeed').mergeIn(
                        [notifIndex],
                        Object.assign({}, state.getIn(['notifFeed', notifIndex]), {
                            tag: [].concat(state.getIn(['notifFeed', notifIndex]).tag, action.payload.tag)
                        })
                    ),
                hasFeed: true
            };
        }
        return state.merge(feedObj);
    },
    [types.FEED_YOU_NOTIF]: (state, action) => {
        let updatedFeed;
        const notifIndex = action.payload.type === 'publish' ?
            state.get('youFeed').findIndex(notif =>
                notif.author && notif.author.profile === action.payload.author.profile &&
                notif.entry.entryId === action.payload.entry.entryId) :
            -1;
        const feedNr = notifIndex === -1 ?
            state.get('youNrFeed') + 1 :
            state.get('youNrFeed');
        if (state.get('youFeed').size < maxFeed || notifIndex !== -1) {
            updatedFeed = notifIndex === -1 ?
                state.get('youFeed').unshift(action.payload) :
                state.get('youFeed').mergeIn(
                    [notifIndex],
                    Object.assign({}, state.getIn(['youFeed', notifIndex]), {
                        tag: [].concat(state.getIn(['youFeed', notifIndex]).tag, action.payload.tag)
                    })
                );
        } else {
            updatedFeed = state.get('youFeed').pop();
            updatedFeed = updatedFeed.unshift(action.payload);
        }
        return state.merge({ youFeed: updatedFeed, youNrFeed: feedNr });
    },
    [types.READ_YOU_NOTIF]: (state, action) => {
        const feedNr = state.get('youNrFeed') - action.payload;
        return state.merge({ youNrFeed: (feedNr > 0) ? feedNr : 0 });
    },
    [types.READ_SUBSCRIPTION_NOTIF]: (state) => {
        if (state.get('hasFeed')) {
            return state.merge({ hasFeed: false });
        }
        return state;
    },
    [types.DELETE_YOU_NOTIF]: (state, action) => {
        const youNotifs = state.get('youFeed').delete(action.payload);
        return state.merge({ youFeed: youNotifs });
    },
    [types.DELETE_FEED_NOTIF]: (state, action) => {
        const feedNotifs = state.get('notifFeed').delete(action.payload);
        return state.merge({ notifFeed: feedNotifs });
    },
    [appTypes.CLEAN_STORE]: () => initialState,
});

export default notificationsState;
