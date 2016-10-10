"use strict";
const GethIPC_1 = require('../lib/ipc/GethIPC');
const electron_1 = require('electron');
const helpers_1 = require('./helpers');
const chai_1 = require('chai');
const channels_1 = require('../lib/channels');
class GethIPCtest extends GethIPC_1.default {
    constructor() {
        super(...arguments);
        this.callTest = new Map();
    }
    fireEvent(channel, data, event) {
        const cb = this.callTest.get(channel);
        return cb(helpers_1.fireEvent(channel, data, event));
    }
}
describe('GethIPC', function () {
    this.timeout(60000);
    let gethChannel;
    before(function (done) {
        chai_1.expect(helpers_1.initLogger()).to.exist;
        setTimeout(done, 200);
    });
    it('--constructs channel api', function () {
        gethChannel = new GethIPCtest();
        chai_1.expect(gethChannel).to.exist;
    });
    it('--can init listeneres', function () {
        gethChannel.initListeners(null);
        chai_1.expect(gethChannel.listeners.size).to.be.above(0);
    });
    it('--should add to listened channels', function (done) {
        let listenersNr = 0;
        const listenOn = [
            channels_1.default.server.geth.syncStatus,
            channels_1.default.server.geth.logs
        ];
        gethChannel.callTest.set(channels_1.default.client.geth.manager, (injected) => {
            listenersNr++;
            if (listenersNr === listenOn.length) {
                done();
            }
        });
        listenOn.forEach((channelName) => {
            electron_1.ipcMain.emit(channels_1.default.server.geth.manager, '', { channel: channelName, listen: true });
        });
    });
    it('--should #startService', function (done) {
        gethChannel.callTest.set(channels_1.default.client.geth.startService, (injected) => {
            chai_1.expect(injected.data).to.exist;
            chai_1.expect(injected.data.error).to.not.exist;
            if (injected.data.data.started) {
                done();
            }
        });
        electron_1.ipcMain.emit(channels_1.default.server.geth.startService, {});
    });
    it.skip('--should get #syncStatus', function (done) {
        gethChannel.callTest.set(channels_1.default.client.geth.syncStatus, (injected) => {
            chai_1.expect(injected.data).to.exist;
            chai_1.expect(injected.data.data.synced).to.exist;
            done();
        });
    });
    after(function (done) {
        gethChannel.callTest.set(channels_1.default.client.geth.stopService, (data) => {
            chai_1.expect(data.data).to.exist;
            gethChannel.callTest.clear();
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.geth.stopService);
    });
});
//# sourceMappingURL=GethIPC.test.js.map