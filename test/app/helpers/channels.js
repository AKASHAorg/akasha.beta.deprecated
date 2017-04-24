import { spy } from 'sinon';

const EventEmitter = require('events');

class BasicChannel extends EventEmitter {
    constructor (channelName) {
        super();
        this.channel = channelName;
        this.response = null;
    }
    on (ev, listener) {
        if (typeof ev === 'function') {
            listener = ev;
            ev = this.channel;
        }
        return super.on(ev, data => listener({}, data));
    }
    once (listener) {
        return super.once(this.channel, res => listener({}, res));
    }
    triggerResponse (response, cb) {
        super.emit(this.channel, response);
        if (cb) cb();
    }
    enable () {
        return this.emit(this.channel, {});
    }
    disable () {
        return this.emit(this.channel, {});
    }
}

const generateTheChannel = () => {
    const channel = {
        server: {},
        client: {}
    };
    const modules = [
        'auth.generateEthKey', 'auth.requestEther', 'auth.manager', 'auth.login', 'auth.getLocalIdentities',
        'entry.votesIterator',
        'geth.logs', 'geth.options', 'geth.startService', 'geth.status', 'geth.syncStatus', 'geth.stopService',
        'ipfs.getConfig', 'ipfs.getPorts', 'ipfs.setPorts', 'ipfs.logs', 'ipfs.startService', 'ipfs.status', 'ipfs.stopService',
        'profile.getProfileData', 'profile.getProfileList',
        'registry.getCurrentProfile', 'registry.registerProfile', 'registry.manager',
        'tx.addToQueue', 'tx.emitMined',
        'utils.backupKeys'
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
