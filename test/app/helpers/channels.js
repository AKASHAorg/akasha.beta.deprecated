const EventEmitter = require('events');

class BasicChannel extends EventEmitter {
    constructor (channelName) {
        super();
        this.channelName = channelName;
        this.payload = null;
        this.response = null;
    }
    send (payload) {
        this.payload = payload;
        this.emit(this.channelName, this.response);
    }
    on (listener) {
        this.on(this.channelName, listener);
    }
    once (listener) {
        this.once(this.channelName, listener);
    }
    setResponse (response) {
        this.response = response;
    }
    getResponse () {
        return this.response;
    }
    getPayload () {
        return this.payload;
    }
}

export const Channel = {
    server: {
        auth: {
            generateEthKey: new BasicChannel('generateEthKey')
        }
    },
    client: {
        auth: {
            manager: new BasicChannel('manager'),
            generateEthKey: new BasicChannel('generateEthKey')
        },
        geth: {
            logs: new BasicChannel('logs'),
            options: new BasicChannel('options'),
            stopService: new BasicChannel('stopService')
        },
        ipfs: {
            getConfig: new BasicChannel('getConfig'),
            stopService: new BasicChannel('stopService')
        }
    }
};
