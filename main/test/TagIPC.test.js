"use strict";
const electron_1 = require('electron');
const TagsIPC_1 = require('../lib/ipc/TagsIPC');
const chai_1 = require('chai');
const channels_1 = require('../lib/channels');
const helpers = require('./helpers');
class TagsIPCtest extends TagsIPC_1.default {
    constructor() {
        super(...arguments);
        this.callTest = new Map();
    }
    fireEvent(channel, data, event) {
        const cb = this.callTest.get(channel);
        return cb(helpers.fireEvent(channel, data, event));
    }
}
describe('TagsIPC', function () {
    this.timeout(60000);
    let tagsChannel;
    let token;
    before(function (done) {
        chai_1.expect(helpers.initLogger()).to.exist;
        setTimeout(() => helpers.startServices(done), 400);
    });
    it('--constructs channel api', function () {
        tagsChannel = new TagsIPCtest();
        chai_1.expect(tagsChannel).to.exist;
    });
    it('--can init listeneres', function () {
        tagsChannel.initListeners(null);
        chai_1.expect(tagsChannel.listeners.size).to.be.above(0);
    });
    it('--waits for sync', function (done) {
        helpers.checkSynced(done);
    });
    it('--should add to listened channels from #manager', function (done) {
        let listenersNr = 0;
        const listenOn = [
            channels_1.default.server.tags.create,
            channels_1.default.server.tags.getTagId,
            channels_1.default.server.tags.getTagAt,
            channels_1.default.server.tags.isSubscribed,
            channels_1.default.server.tags.subscribe,
            channels_1.default.server.tags.unsubscribe,
            channels_1.default.server.tags.getSubPosition,
            channels_1.default.server.tags.getTagsFrom,
            channels_1.default.server.tags.getCreateError,
            channels_1.default.server.tags.getTagsCreated,
            channels_1.default.server.tags.getIndexedTag,
            channels_1.default.server.tags.getIndexTagError
        ];
        tagsChannel.callTest.set(channels_1.default.client.tags.manager, (injected) => {
            listenersNr++;
            if (listenersNr === listenOn.length) {
                done();
            }
        });
        listenOn.forEach((channelName) => {
            electron_1.ipcMain.emit(channels_1.default.server.tags.manager, '', { channel: channelName, listen: true });
        });
    });
    it('--should get a token', function (done) {
        helpers.getToken(done, {
            account: helpers.mockedAddress,
            password: helpers.pwd,
            rememberTime: 4
        }, (generated) => {
            token = generated;
        });
    });
    it('--#create', function (done) {
        tagsChannel.callTest.set(channels_1.default.client.tags.create, (injected) => {
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.tx).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.tags.create, '', { token, tagName: 'cars' + new Date().getTime(), gas: 2000000 });
    });
    it('--#getTagId', function (done) {
        tagsChannel.callTest.set(channels_1.default.client.tags.getTagId, (injected) => {
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.tagId).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.tags.getTagId, '', { tagName: 'cars' });
    });
    it('--#getTagAt', function (done) {
        tagsChannel.callTest.set(channels_1.default.client.tags.getTagName, (injected) => {
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.tagName).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.tags.getTagAt, '', { tagId: '2' });
    });
    it('--#getTagAt', function (done) {
        tagsChannel.callTest.set(channels_1.default.client.tags.getTagAt, (injected) => {
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.tagName).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.tags.getTagAt, '', { tagId: 2 });
    });
    it('--#isSubscribed', function (done) {
        tagsChannel.callTest.set(channels_1.default.client.tags.isSubscribed, (injected) => {
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.subscribed).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.tags.isSubscribed, '', { tagId: helpers.tagId, address: helpers.profileAddress });
    });
    it('--#subscribe', function (done) {
        tagsChannel.callTest.set(channels_1.default.client.tags.subscribe, (injected) => {
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.tx).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.tags.subscribe, '', { tagName: helpers.tagName, token, gas: 2000000 });
    });
    it('--#getSubPosition', function (done) {
        tagsChannel.callTest.set(channels_1.default.client.tags.getSubPosition, (injected) => {
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.position).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.tags.getSubPosition, '', { tagId: helpers.tagId, address: helpers.profileAddress });
    });
    it('--#unsubscribe', function (done) {
        tagsChannel.callTest.set(channels_1.default.client.tags.unsubscribe, (injected) => {
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.tx).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.tags.unsubscribe, '', {
            tagName: helpers.tagName,
            subPosition: 0,
            token,
            gas: 2000000
        });
    });
    it('--#getTagsFrom', function (done) {
        tagsChannel.callTest.set(channels_1.default.client.tags.getTagsFrom, (injected) => {
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.tags).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.tags.getTagsFrom, '', { from: 0, to: 10 });
    });
    it('--#getCreateError', function (done) {
        tagsChannel.callTest.set(channels_1.default.client.tags.getCreateError, (injected) => {
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.events).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.tags.getCreateError, '', { fromBlock: 0, address: helpers.profileAddress });
    });
    it('--#getTagsCreated', function (done) {
        tagsChannel.callTest.set(channels_1.default.client.tags.getTagsCreated, (injected) => {
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.collection).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.tags.getTagsCreated, '', { fromBlock: 0, address: helpers.profileAddress });
    });
    it('--#getIndexedTag', function (done) {
        tagsChannel.callTest.set(channels_1.default.client.tags.getIndexedTag, (injected) => {
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.events).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.tags.getIndexedTag, '', { fromBlock: 0, address: helpers.profileAddress });
    });
    it('--#getIndexTagError', function (done) {
        tagsChannel.callTest.set(channels_1.default.client.tags.getIndexTagError, (injected) => {
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.events).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.tags.getIndexTagError, '', { fromBlock: 0, address: helpers.profileAddress });
    });
    after(function (done) {
        helpers.stopServices(done);
    });
});
//# sourceMappingURL=TagIPC.test.js.map