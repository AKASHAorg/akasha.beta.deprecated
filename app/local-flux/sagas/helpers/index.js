import { eventChannel } from 'redux-saga';
import { put, take } from 'redux-saga/effects';

const Channel = window.Channel;
export const actionChannels = {};

// this function creates an event channel from a given ipc client channel
export function createActionChannel (channel) {
    return eventChannel((emit) => {
        const handler = (ev, resp) => {
            emit(resp);
        };

        channel.on(handler);

        const unsubscribe = () => {
            channel.removeListener(handler);
        };

        return unsubscribe;
    });
}

export function createActionChannels () {
    // const modules = Object.keys(Channel.client);
    // modules.forEach((module) => {
    //     const channels = Object.keys(Channel.client[module]);
    //     actionChannels[module] = {};
    //     channels.forEach((channel) => {
    //         const actionChannel = createActionChannel(Channel.client[module][channel]);
    //         actionChannels[module][channel] = actionChannel;
    //     });
    // });

    // TODO: After refactoring, remove the following lines and uncomment the ones above
    const modules = Object.keys(Channel.client);
    modules.forEach((module) => { actionChannels[module] = {}; });
    const gethChannels = ['logs', 'options', 'stopService'];
    gethChannels.forEach((channel) => {
        actionChannels.geth[channel] = createActionChannel(Channel.client.geth[channel]);
    });
    const ipfsChannels = ['getConfig', 'stopService'];
    ipfsChannels.forEach((channel) => {
        actionChannels.ipfs[channel] = createActionChannel(Channel.client.ipfs[channel]);
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

export function* registerListener ({ channel, successAction, errorAction }) {
    while (true) {
        const resp = take(channel);
        if (resp.error && errorAction) {
            yield put(errorAction());
        } else if (successAction) {
            yield put(successAction());
        }
    }
}
