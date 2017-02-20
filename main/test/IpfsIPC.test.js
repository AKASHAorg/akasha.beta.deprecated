"use strict";
const electron_1 = require("electron");
const helpers_1 = require("./helpers");
const chai_1 = require("chai");
const channels_1 = require("../lib/channels");
describe('IpfsIPC', function () {
    this.timeout(120000);
    before(function (done) {
        chai_1.expect(helpers_1.initLogger()).to.exist;
        setTimeout(done, 200);
    });
    it('--constructs channel api', function () {
        chai_1.expect(helpers_1.ipfsChannel).to.exist;
    });
    it('--can init listeneres', function () {
        chai_1.expect(helpers_1.ipfsChannel.listeners.size).to.be.above(0);
    });
    it('--should add to listened channels from #manager', function (done) {
        let listenersNr = 0;
        const listenOn = [
            channels_1.default.server.ipfs.getConfig,
            channels_1.default.server.ipfs.setPorts,
            channels_1.default.server.ipfs.getPorts
        ];
        helpers_1.ipfsChannel.callTest.set(channels_1.default.client.ipfs.manager, (injected) => {
            listenersNr++;
            if (listenersNr === listenOn.length) {
                done();
            }
        });
        listenOn.forEach((channelName) => {
            electron_1.ipcMain.emit(channels_1.default.server.ipfs.manager, '', { channel: channelName, listen: true });
        });
    });
    it('--should #startService', function (done) {
        helpers_1.ipfsChannel.callTest.set(channels_1.default.client.ipfs.startService, (injected) => {
            chai_1.expect(injected.data).to.exist;
            chai_1.expect(injected.data.error).to.not.exist;
            if (injected.data.data.started) {
                done();
            }
        });
        electron_1.ipcMain.emit(channels_1.default.server.ipfs.startService, '', {});
    });
    it('--should get ipfs config #getConfig', function (done) {
        helpers_1.ipfsChannel.callTest.set(channels_1.default.client.ipfs.getConfig, (injected) => {
            chai_1.expect(injected.data).to.exist;
            chai_1.expect(injected.data.data.apiPort).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.ipfs.getConfig, '', {});
    });
    it('--should #setPorts', function (done) {
        helpers_1.ipfsChannel.callTest.set(channels_1.default.client.ipfs.setPorts, (injected) => {
            chai_1.expect(injected.data).to.exist;
            chai_1.expect(injected.data.data.set).to.be.true;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.ipfs.setPorts, '', { ports: { gateway: 8899 } });
    });
    it('--should get #status', function (done) {
        helpers_1.ipfsChannel.callTest.set(channels_1.default.client.ipfs.status, (injected) => {
            chai_1.expect(injected.data).to.exist;
            chai_1.expect(injected.data.data.spawned).to.be.true;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.ipfs.status, '', {});
    });
    it('--should #getPorts', function (done) {
        helpers_1.ipfsChannel.callTest.set(channels_1.default.client.ipfs.getPorts, (injected) => {
            chai_1.expect(injected.data).to.exist;
            chai_1.expect(injected.data.data.api).to.exist;
            chai_1.expect(injected.data.error).to.not.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.ipfs.getPorts, '', {});
    });
    after(function (done) {
        helpers_1.ipfsChannel.callTest.set(channels_1.default.client.ipfs.stopService, (data) => {
            chai_1.expect(data.data).to.exist;
            helpers_1.ipfsChannel.callTest.clear();
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.ipfs.stopService, '', {});
    });
});
//# sourceMappingURL=IpfsIPC.test.js.map