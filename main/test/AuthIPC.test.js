"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const helpers_1 = require("./helpers");
const chai_1 = require("chai");
const channels_1 = require("../lib/channels");
const timers_1 = require("timers");
describe('AuthIPC', function () {
    this.timeout(120000);
    before(function (done) {
        chai_1.expect(helpers_1.initLogger()).to.exist;
        timers_1.setTimeout(() => helpers_1.startServices(done), 400);
    });
    it('--constructs channel api', function () {
        chai_1.expect(helpers_1.authChannel).to.exist;
    });
    it('--can init listeneres', function () {
        chai_1.expect(helpers_1.authChannel.listeners.size).to.be.above(0);
    });
    it('--waits for sync', function (done) {
        helpers_1.checkSynced(done);
    });
    it('--should add to listened channels from #manager', function (done) {
        let listenersNr = 0;
        const listenOn = [
            channels_1.default.server.auth.generateEthKey,
            channels_1.default.server.auth.getLocalIdentities
        ];
        helpers_1.authChannel.callTest.set(channels_1.default.client.auth.manager, (injected) => {
            listenersNr++;
            if (listenersNr === listenOn.length) {
                done();
            }
        });
        listenOn.forEach((channelName) => {
            electron_1.ipcMain.emit(channels_1.default.server.auth.manager, '', { channel: channelName, listen: true });
        });
    });
    it.skip('--should create new ethereum address #generateEthKey', function (done) {
        helpers_1.authChannel.callTest.set(channels_1.default.client.auth.generateEthKey, (injected) => {
            chai_1.expect(injected.data).to.exist;
            chai_1.expect(injected.data.data.address).to.exist;
            chai_1.expect(injected.data.error).to.not.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.auth.generateEthKey, '', { password: helpers_1.pwd });
    });
    it('--should request from faucet #requestEther', function (done) {
        helpers_1.authChannel.callTest.set(channels_1.default.client.auth.requestEther, (injected) => {
            chai_1.expect(injected.data).to.exist;
            chai_1.expect(injected.data.data.tx).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.auth.requestEther, '', { address: helpers_1.mockedAddress });
    });
    it('--should check for profiles #getLocalIdentities', function (done) {
        helpers_1.authChannel.callTest.set(channels_1.default.client.auth.getLocalIdentities, (injected) => {
            chai_1.expect(injected.data).to.exist;
            chai_1.expect(injected.data.data).to.be.instanceof(Array);
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.auth.getLocalIdentities, '', {});
    });
    it('--should #login', function (done) {
        helpers_1.authChannel.callTest.set(channels_1.default.client.auth.login, (injected) => {
            chai_1.expect(injected.data).to.exist;
            chai_1.expect(injected.data.data.token).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.auth.login, '', { account: helpers_1.mockedAddress, password: helpers_1.pwd, rememberTime: 1 });
    });
    it('--should #logout', function (done) {
        helpers_1.authChannel.callTest.set(channels_1.default.client.auth.logout, (injected) => {
            chai_1.expect(injected.data).to.exist;
            chai_1.expect(injected.data.data.done).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.auth.logout, '', {});
    });
    after(function (done) {
        helpers_1.stopServices(done);
    });
});
//# sourceMappingURL=AuthIPC.test.js.map