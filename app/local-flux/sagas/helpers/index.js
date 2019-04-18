// import { eventChannel } from 'redux-saga';
// import { put, select, take } from 'redux-saga/effects';
// import { tap } from 'ramda';
// import { selectAction, selectLoggedEthAddress } from '../../selectors';

// const Channel = global.Channel;
// export const actionChannels = {};
// export const enabledChannels = [];

// this function creates an event channel from a given ipc client channel
// export function createActionChannel (channel) {
//     return eventChannel((emit) => {
//         const handler = (ev, resp) => {
//             tap(emit, resp);
//         };
//         channel.on(handler);

//         const unsubscribe = () => {
//             channel.removeListener(handler);
//         };

//         return unsubscribe;
//     });
// }

// export function* registerListener ({ channel, successAction, errorAction }) {
//     while (true) {
//         const resp = take(channel);
//         if (resp.error && errorAction) {
//             yield put(errorAction());
//         } else if (successAction) {
//             yield put(successAction());
//         }
//     }
// }

export function deprecatedTypeWarning (useAction) {
    /* eslint-disable no-console */
    return function* (action) {
        yield console.error(action.type, 'is deprecated. Please use', useAction);
    };
    /* eslint-enable no-console */
}
