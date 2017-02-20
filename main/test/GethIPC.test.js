"use strict";
const electron_1 = require("electron");
const helpers_1 = require("./helpers");
const chai_1 = require("chai");
const channels_1 = require("../lib/channels");
describe('GethIPC', function () {
    this.timeout(60000);
    before(function (done) {
        chai_1.expect(helpers_1.initLogger()).to.exist;
        setTimeout(done, 200);
    });
    it('--constructs channel api', function () {
        chai_1.expect(helpers_1.gethChannel).to.exist;
    });
    it('--can init listeneres', function () {
        chai_1.expect(helpers_1.gethChannel.listeners.size).to.be.above(0);
    });
    it('--should add to listened channels from #manager', function (done) {
        let listenersNr = 0;
        const listenOn = [
            channels_1.default.server.geth.syncStatus,
            channels_1.default.server.geth.logs,
            channels_1.default.server.geth.options
        ];
        helpers_1.gethChannel.callTest.set(channels_1.default.client.geth.manager, (injected) => {
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
        helpers_1.gethChannel.callTest.set(channels_1.default.client.geth.startService, (injected) => {
            chai_1.expect(injected.data).to.exist;
            chai_1.expect(injected.data.error).to.not.exist;
            if (injected.data.data.started) {
                done();
            }
        });
        electron_1.ipcMain.emit(channels_1.default.server.geth.startService, '', {});
    });
    it('--should get #syncStatus', function (done) {
        helpers_1.gethChannel.callTest.set(channels_1.default.client.geth.syncStatus, (injected) => {
            chai_1.expect(injected.data).to.exist;
            chai_1.expect(injected.data.data.synced).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.geth.syncStatus, '', {});
    });
    it('--should get #logs', function (done) {
        helpers_1.gethChannel.callTest.set(channels_1.default.client.geth.logs, (injected) => {
            chai_1.expect(injected.data).to.exist;
            chai_1.expect(injected.data.error).to.not.exist;
            chai_1.expect(injected.data.data.gethInfo).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.geth.logs, '', {});
    });
    it('--should get service #status', function (done) {
        helpers_1.gethChannel.callTest.set(channels_1.default.client.geth.status, (injected) => {
            chai_1.expect(injected.data).to.exist;
            chai_1.expect(injected.data.error).to.not.exist;
            chai_1.expect(injected.data.data.api).to.exist;
            chai_1.expect(injected.data.data.spawned).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.geth.status, '', {});
    });
    it('--should set geth starting #options', function (done) {
        const fakePath = '/fake/path';
        helpers_1.gethChannel.callTest.set(channels_1.default.client.geth.options, (injected) => {
            chai_1.expect(injected.data).to.exist;
            chai_1.expect(injected.data.error).to.not.exist;
            chai_1.expect(injected.data.data.datadir).to.equal(fakePath);
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.geth.options, '', { datadir: fakePath });
    });
    after(function (done) {
        helpers_1.gethChannel.callTest.set(channels_1.default.client.geth.stopService, (data) => {
            chai_1.expect(data.data).to.exist;
            helpers_1.gethChannel.callTest.clear();
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.geth.stopService);
    });
});
//# sourceMappingURL=GethIPC.test.js.map