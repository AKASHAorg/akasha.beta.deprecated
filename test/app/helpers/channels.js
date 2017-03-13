import { spy } from 'sinon';

const EventEmitter = require('events');

class BasicChannel extends EventEmitter {
    constructor (channelName) {
        super();
        this.channel = channelName;
        this.channelName = channelName;
    }
    on (ev, listener) {
        if (typeof ev === 'function') {
            listener = ev;
            ev = this.channelName;
        }
        return super.on(ev, data => listener({}, data));
    }
    once (listener) {
        return super.once(this.channelName, res => listener({}, res));
    }
    triggerResponse (response) {
        return super.emit(this.channelName, response);
    }
    enable () {
        return super.emit(this.channelName, {});
    }
    disable () {
        return super.emit(this.channelName, {});
    }
}

const generateTheChannel = () => {
    const channel = {
        server: {},
        client: {}
    };
    const modules = [
        'auth.generateEthKey', 'auth.requestEther', 'auth.login',
        'geth.logs', 'geth.options', 'geth.startService', 'geth.status', 'geth.syncStatus', 'geth.stopService',
        'ipfs.getConfig', 'ipfs.getPorts', 'ipfs.setPorts', 'ipfs.logs', 'ipfs.startService', 'ipfs.status', 'ipfs.stopService',
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
Channel.client.auth.manager = new BasicChannel('auth.manager');
global.Channel = Channel;
export default Channel;
