"use strict";
const electron_1 = require('electron');
const RegistryIPC_1 = require('../lib/ipc/RegistryIPC');
const chai_1 = require('chai');
const channels_1 = require('../lib/channels');
const helpers = require('./helpers');
class RegistryIPCtest extends RegistryIPC_1.default {
    constructor() {
        super(...arguments);
        this.callTest = new Map();
    }
    fireEvent(channel, data, event) {
        const cb = this.callTest.get(channel);
        return cb(helpers.fireEvent(channel, data, event));
    }
}
describe('RegistryIPC', function () {
    this.timeout(120000);
    let registryChannel;
    let token;
    let ethAddress;
    let txPending;
    before(function (done) {
        chai_1.expect(helpers.initLogger()).to.exist;
        setTimeout(() => helpers.startServices(done), 400);
    });
    it('--constructs channel api', function () {
        registryChannel = new RegistryIPCtest();
        chai_1.expect(registryChannel).to.exist;
    });
    it('--can init listeneres', function () {
        registryChannel.initListeners(null);
        chai_1.expect(registryChannel.listeners.size).to.be.above(0);
    });
    it('--waits for sync', function (done) {
        helpers.checkSynced(done);
    });
    it('--should add to listened channels from #manager', function (done) {
        let listenersNr = 0;
        const listenOn = [
            channels_1.default.server.registry.profileExists,
            channels_1.default.server.registry.registerProfile,
            channels_1.default.server.registry.getErrorEvent,
            channels_1.default.server.registry.getRegistered
        ];
        registryChannel.callTest.set(channels_1.default.client.registry.manager, (injected) => {
            listenersNr++;
            if (listenersNr === listenOn.length) {
                done();
            }
        });
        listenOn.forEach((channelName) => {
            electron_1.ipcMain.emit(channels_1.default.server.registry.manager, '', { channel: channelName, listen: true });
        });
    });
    it('--should check if profile exists #profileExists', function (done) {
        registryChannel.callTest.set(channels_1.default.client.registry.profileExists, (injected) => {
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.exists).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.registry.profileExists, '', { username: 'costel' });
    });
    it('--should register new address', function (done) {
        helpers.getNewAddress(done, (newAddress) => {
            ethAddress = newAddress;
        });
    });
    it('--should get aethers', function (done) {
        helpers.getAethers(done, ethAddress, (tx) => {
            txPending = tx;
        });
    });
    it('--should get a token', function (done) {
        helpers.getToken(done, { account: ethAddress, password: helpers.pwd, rememberTime: 2 }, (generated) => {
            token = generated;
        });
    });
    it('--should wait for #pendingTx', function (done) {
        helpers.confirmTx(done, txPending);
    });
    it('--should register new profile #registerProfile', function (done) {
        registryChannel.callTest.set(channels_1.default.client.registry.registerProfile, (injected) => {
            chai_1.expect(injected.data).to.exist;
            chai_1.expect(injected.data.data.tx).to.exist;
            txPending = injected.data.data.tx;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.registry.registerProfile, '', { token, username: 'TuserT' + new Date().getTime(),
            ipfs: { firstName: 'Tritza', lastName: 'Fanica' + new Date().getTime(),
                avatar: new Uint8Array(1000000),
                backgroundImage: {
                    xs: { src: new Uint8Array(1000000), width: 100, height: 100 },
                    sm: { src: new Uint8Array(1000000), width: 200, height: 100 },
                    md: { src: new Uint8Array(1000000), width: 300, height: 100 },
                } } });
    });
    it('--should wait for registry tx', function (done) {
        helpers.confirmTx(done, txPending);
    });
    after(function (done) {
        helpers.stopServices(done);
    });
});
//# sourceMappingURL=RegistryIPC.test.js.map