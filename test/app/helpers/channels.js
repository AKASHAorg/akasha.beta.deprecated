import { spy } from 'sinon';

const EventEmitter = require('events');

class BasicChannel extends EventEmitter {
    constructor (channelName) {
        super();
        this.channelName = channelName;
    }
    on (listener) {
        return super.on(this.channelName, listener);
    }
    once (listener) {
        return super.once(this.channelName, listener);
    }
    triggerResponse (response) {
        return super.emit(this.channelName, response);
    }
    enable () {
        return super.emit('manager', {});
    }
    disable () {
        return super.emit('manager', {});
    }
}

const generateTheChannel = () => {
    const channel = {
        server: {},
        client: {}
    };
    const modules = [
        'auth.generateEthKey', 'auth.requestEther', 'auth.manager', 'auth.login',
        'geth.logs', 'geth.options', 'geth.startService', 'geth.status', 'geth.syncStatus', 'geth.stopService',
        'ipfs.getConfig', 'ipfs.startService', 'ipfs.status', 'ipfs.stopService',
        'tx.addToQueue', 'tx.emitMined'
    ];
    for (let i = modules.length - 1; i >= 0; i -= 1) {
        const module = modules[i];
        const parts = module.split('.');
        if (!channel.server[parts[0]]) {
            channel.server[parts[0]] = {};
        }
        channel.server[parts[0]][parts[1]] = {
            send: spy(),
            enable: spy(),
            disable: spy()
        };
        if (!channel.client[parts[0]]) {
            channel.client[parts[0]] = {};
        }
        channel.client[parts[0]][parts[1]] = new BasicChannel(module);
    }
    return channel;
};

const Channel = generateTheChannel();
global.Channel = Channel;
export default Channel;
