import { eventChannel } from 'redux-saga';

// this function creates an event channel from a given ipc client channel
export function createEventChannel (channel) {
    return eventChannel((emit) => {
        const handler = (ev, resp) => {
            emit(resp.data);
        };

        channel.on(handler);

        const unsubscribe = () => {
            channel.removeListener(handler);
        };

        return unsubscribe;
    });
}


export function enableChannel (channel, mananger) {
    const promise = new Promise((resolve, reject) => {
        mananger.once((ev, resp) => {
            // if (resp.data.channel === channel.channel && resp.data.listen) {
            //     console.log('resolve promise');
            //     resolve();
            // } else {
            //     console.log('reject promise');
            //     reject();
            // }
            resolve();
        });
        channel.enable();
    });
    return promise;
}
