import { fromJS } from 'immutable';
import * as types from '../constants/NotificationsConstants';
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
        let updatedFeed, feedObj;
        const hasFeed = !state.get('hasFeed');
        if(action.payload.hasOwnProperty('running')){
            return state;
        }
        if (state.get('notifFeed').size > maxFeed) {
            updatedFeed = state.get('notifFeed').pop();
            feedObj = { notifFeed: updatedFeed.unshift(action.payload), hasFeed };
        } else {
            feedObj = { notifFeed: state.get('notifFeed').unshift(action.payload), hasFeed };
        }


        return state.merge(feedObj)
    },
    [types.FEED_YOU_NOTIF]: (state, action) => {
        let updatedFeed;
        const feedNr = state.get('youNrFeed') + 1;
        if (state.get('youFeed').size < maxFeed) {
            updatedFeed = state.get('youFeed').unshift(action.payload);
        } else {
            updatedFeed = state.get('youFeed').pop();
            updatedFeed = updatedFeed.unshift(action.payload);
        }
        return state.merge({ youFeed: updatedFeed, youNrFeed: feedNr })
    },
    [types.READ_YOU_NOTIF]: (state, action) => {
        const feedNr = state.get('youNrFeed') - action.payload;
        return state.merge({ youNrFeed: (feedNr > 0) ? feedNr : 0 });
    },
    [types.READ_SUBSCRIPTION_NOTIF]: (state, action) => {
        if (state.get("hasFeed")) {
            return state.merge({ hasFeed: false });
        }
        return state;
    },
    [types.DELETE_YOU_NOTIF]: (state, action) => {
        const youNotifs = state.get('youFeed').delete(action.payload);
        return state.merge({youFeed: youNotifs});
    },
    [types.DELETE_FEED_NOTIF]: (state, action) => {
        const feedNotifs = state.get('notifFeed').delete(action.payload);
        return state.merge({notifFeed: feedNotifs});
    }
});

export default notificationsState;
