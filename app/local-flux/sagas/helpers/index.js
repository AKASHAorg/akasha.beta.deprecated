import { eventChannel } from 'redux-saga';
import { put, take } from 'redux-saga/effects';

const Channel = global.Channel;
export const actionChannels = {};
export const enabledChannels = [];

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
    const gethChannels = ['logs', 'options', 'startService', 'status', 'stopService', 'syncStatus'];
    gethChannels.forEach((channel) => {
        actionChannels.geth[channel] = createActionChannel(Channel.client.geth[channel]);
    });
    const ipfsChannels = ['getConfig', 'getPorts', 'setPorts', 'logs', 'startService', 'status', 'stopService'];
    ipfsChannels.forEach((channel) => {
        actionChannels.ipfs[channel] = createActionChannel(Channel.client.ipfs[channel]);
    });
    const authChannels = ['generateEthKey', 'login', 'requestEther'];
    authChannels.forEach((channel) => {
        actionChannels.auth[channel] = createActionChannel(Channel.client.auth[channel]);
    });
    const registryChannels = ['registerProfile'];
    registryChannels.forEach((channel) => {
        actionChannels.registry[channel] = createActionChannel(Channel.client.registry[channel]);
    });
    const txChannels = ['addToQueue', 'emitMined'];
    txChannels.forEach((channel) => {
        actionChannels.tx[channel] = createActionChannel(Channel.client.tx[channel]);
    });
}

export function enableChannel (channel, mananger) {
    const promise = new Promise((resolve, reject) => {
        if (enabledChannels.indexOf(channel.channel) !== -1) {
            resolve();
            return;
        }
        mananger.once((ev, resp) => {
            enabledChannels.push(channel.channel);
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
