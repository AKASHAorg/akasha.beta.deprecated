"use strict";
const Logger_1 = require('../lib/ipc/Logger');
const GethIPC_1 = require('../lib/ipc/GethIPC');
const IpfsIPC_1 = require('../lib/ipc/IpfsIPC');
const TxIPC_1 = require('../lib/ipc/TxIPC');
const electron_1 = require('electron');
const chai_1 = require('chai');
const channels_1 = require('../lib/channels');
const AuthIPC_1 = require('../lib/ipc/AuthIPC');
class AuthIPCtest extends AuthIPC_1.default {
    constructor() {
        super(...arguments);
        this.callTest = new Map();
    }
    fireEvent(channel, data, event) {
        const cb = this.callTest.get(channel);
        return cb(exports.fireEvent(channel, data, event));
    }
}
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
class TxIPCtest extends TxIPC_1.default {
    constructor() {
        super(...arguments);
        this.callTest = new Map();
    }
    fireEvent(channel, data, event) {
        const cb = this.callTest.get(channel);
        return cb(exports.fireEvent(channel, data, event));
    }
}
exports.TxIPCtest = TxIPCtest;
exports.gethChannel = new GethIPCtest();
exports.ipfsChannel = new IpfsIPCtest();
exports.authChannel = new AuthIPCtest();
exports.txChannel = new TxIPCtest();
exports.tagId = 2;
exports.tagName = 'cars1477052930372';
exports.pwd = Buffer.from("abc12345");
exports.mockedAddress = '0x9e86b867884e8f84ea4764fed6d3e0931b48f24d';
exports.profileAddress = '0x3543f9dedcc22d2c3be06f5223137f101df9010b';
exports.initLogger = () => {
    return Logger_1.default.getInstance();
};
exports.fireEvent = (channel, data, event) => {
    return { channel, data, event };
};
exports.startServices = (done) => {
    console.log('### starting services, waiting for #started event ###');
    exports.gethChannel.initListeners(null);
    exports.ipfsChannel.initListeners(null);
    exports.authChannel.initListeners(null);
    exports.txChannel.initListeners(null);
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
    electron_1.ipcMain.emit(channels_1.default.server.ipfs.stopService, '', {});
    electron_1.ipcMain.emit(channels_1.default.server.geth.stopService, '', {});
};
exports.checkSynced = (done) => {
    let interval;
    exports.gethChannel.callTest.set(channels_1.default.client.geth.manager, (injected) => {
        return injected;
    });
    electron_1.ipcMain.emit(channels_1.default.server.geth.manager, '', {
        channel: channels_1.default.server.geth.syncStatus,
        listen: true
    });
    exports.gethChannel.callTest.set(channels_1.default.client.geth.syncStatus, (injected) => {
        if (injected.data.data.synced) {
            clearInterval(interval);
            done();
        }
        return injected;
    });
    interval = setInterval(() => electron_1.ipcMain.emit(channels_1.default.server.geth.syncStatus, '', {}), 1000);
};
exports.getToken = (done, authData, collect) => {
    exports.authChannel.callTest.set(channels_1.default.client.auth.login, (injected) => {
        chai_1.expect(injected.data.data.token).to.exist;
        collect(injected.data.data.token);
        done();
    });
    electron_1.ipcMain.emit(channels_1.default.server.auth.login, '', authData);
};
exports.getNewAddress = (done, collect) => {
    exports.authChannel.callTest.set(channels_1.default.client.auth.manager, (injected) => {
        return injected;
    });
    electron_1.ipcMain.emit(channels_1.default.server.auth.manager, '', {
        channel: channels_1.default.server.auth.generateEthKey,
        listen: true
    });
    exports.authChannel.callTest.set(channels_1.default.client.auth.generateEthKey, (injected) => {
        chai_1.expect(injected.data).to.exist;
        chai_1.expect(injected.data.data.address).to.exist;
        chai_1.expect(injected.data.error).to.not.exist;
        collect(injected.data.data.address);
        done();
    });
    setTimeout(() => {
        electron_1.ipcMain.emit(channels_1.default.server.auth.generateEthKey, '', { password: exports.pwd });
    }, 1000);
};
exports.getAethers = (done, address, collect) => {
    exports.authChannel.callTest.set(channels_1.default.client.auth.requestEther, (injected) => {
        chai_1.expect(injected.data).to.exist;
        chai_1.expect(injected.data.data.tx).to.exist;
        collect(injected.data.data.tx);
        done();
    });
    electron_1.ipcMain.emit(channels_1.default.server.auth.requestEther, '', { address });
};
exports.confirmTx = (done, tx) => {
    exports.txChannel.callTest.set(channels_1.default.client.tx.addToQueue, (injected) => {
        return injected;
    });
    exports.txChannel.callTest.set(channels_1.default.client.tx.emitMined, (injected) => {
        chai_1.expect(injected.data).to.exist;
        chai_1.expect(injected.data.data.mined).to.exist;
        if (injected.data.data.mined === tx) {
            done();
        }
    });
    electron_1.ipcMain.emit(channels_1.default.server.tx.addToQueue, '', [{ tx }]);
};
//# sourceMappingURL=helpers.js.map