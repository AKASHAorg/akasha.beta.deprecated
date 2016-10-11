"use strict";
const Logger_1 = require('../lib/ipc/Logger');
const GethIPC_1 = require('../lib/ipc/GethIPC');
const IpfsIPC_1 = require('../lib/ipc/IpfsIPC');
const electron_1 = require('electron');
const chai_1 = require('chai');
const channels_1 = require('../lib/channels');
class GethIPCtest extends GethIPC_1.default {
    constructor() {
        super(...arguments);
        this.callTest = new Map();
    }
    fireEvent(channel, data, event) {
        const cb = this.callTest.get(channel);
        return cb(exports.fireEvent(channel, data, event));
    }
}
exports.GethIPCtest = GethIPCtest;
class IpfsIPCtest extends IpfsIPC_1.default {
    constructor() {
        super(...arguments);
        this.callTest = new Map();
    }
    fireEvent(channel, data, event) {
        const cb = this.callTest.get(channel);
        return cb(exports.fireEvent(channel, data, event));
    }
}
exports.IpfsIPCtest = IpfsIPCtest;
exports.gethChannel = new GethIPCtest();
exports.ipfsChannel = new IpfsIPCtest();
exports.pwd = Buffer.from("abc123");
exports.mockedAddress = '0xb9d31a9e8cbddad80eac90852543142f13bebcb3';
exports.initLogger = () => {
    return Logger_1.default.getInstance();
};
exports.fireEvent = (channel, data, event) => {
    return { channel, data, event };
};
exports.startServices = (done) => {
    console.log('starting services, waiting for #started event...');
    exports.gethChannel.initListeners(null);
    exports.ipfsChannel.initListeners(null);
    const running = [];
    exports.gethChannel.callTest.set(channels_1.default.client.geth.startService, (injected) => {
        chai_1.expect(injected.data).to.exist;
        chai_1.expect(injected.data.error).to.not.exist;
        if (injected.data.data.started) {
            running.push(1);
            if (running.indexOf(1) !== -1 && running.indexOf(2) !== -1) {
                done();
            }
        }
    });
    exports.ipfsChannel.callTest.set(channels_1.default.client.ipfs.startService, (injected) => {
        chai_1.expect(injected.data).to.exist;
        chai_1.expect(injected.data.error).to.not.exist;
        if (injected.data.data.started) {
            running.push(2);
            if (running.indexOf(1) !== -1 && running.indexOf(2) !== -1) {
                done();
            }
        }
    });
    electron_1.ipcMain.emit(channels_1.default.server.geth.startService, '', {});
    electron_1.ipcMain.emit(channels_1.default.server.ipfs.startService, '', {});
};
exports.stopServices = (done) => {
    exports.gethChannel.callTest.set(channels_1.default.client.geth.stopService, (injected) => {
        if (!injected.data.data.spawned) {
            done();
        }
    });
    exports.gethChannel.callTest.set(channels_1.default.client.ipfs.stopService, (injected) => {
        return injected;
    });
    electron_1.ipcMain.emit(channels_1.default.server.ipfs.stopService);
    electron_1.ipcMain.emit(channels_1.default.server.geth.stopService);
};
exports.checkSynced = (done) => {
    let interval;
    exports.gethChannel.callTest.set(channels_1.default.client.geth.manager, (injected) => {
        return injected;
    });
    electron_1.ipcMain.emit(channels_1.default.server.geth.manager, '', { channel: channels_1.default.server.geth.syncStatus, listen: true });
    exports.gethChannel.callTest.set(channels_1.default.client.geth.syncStatus, (injected) => {
        if (injected.data.data.synced) {
            clearInterval(interval);
            done();
        }
        return injected;
    });
    interval = setInterval(() => electron_1.ipcMain.emit(channels_1.default.server.geth.syncStatus, '', {}), 1000);
};
//# sourceMappingURL=helpers.js.map