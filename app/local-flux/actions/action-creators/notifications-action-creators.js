import * as types from '../../constants/NotificationsConstants';

export function receiveSubscriptionFeed (feed) {
    return {
        type: types.FEED_SUBSCRIPTION_NOTIF,
        payload: feed
    };
}

export function readSubscriptionFeed () {
    return {
        type: types.READ_SUBSCRIPTION_NOTIF
    };
}

export function receiveYouFeed (feed) {
    return {
        type: types.FEED_YOU_NOTIF,
        payload: feed
    };
}

export function readYouNotif (number) {
    return {
        type: types.READ_YOU_NOTIF,
        payload: number
    };
}

export function deleteYouNotif (index) {
    return {
        type: types.DELETE_YOU_NOTIF,
        payload: index
    };
}

export function deleteFeedNotif (index) {
    return {
        type: types.DELETE_FEED_NOTIF,
        payload: index
    };
}

export function clearNotifications () {
    return {
        type: types.CLEAR_NOTIFICATIONS
    };
}
