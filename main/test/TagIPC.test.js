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
    let txPending;
    let tagName;
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
            channels_1.default.server.tags.getTagName,
            channels_1.default.server.tags.subscribe,
            channels_1.default.server.tags.unSubscribe,
            channels_1.default.server.tags.getTagCount,
            channels_1.default.server.tags.subsCount,
            channels_1.default.server.tags.getTagsCreated
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
            console.log(injected.data);
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.tx).to.exist;
            txPending = injected.data.data.tx;
            done();
        });
        tagName = 'tag-no' + new Date().getTime();
        electron_1.ipcMain.emit(channels_1.default.server.tags.create, '', { token, tagName: tagName, gas: 2000000 });
    });
    it('--should wait for creating tag tx', function (done) {
        helpers.confirmTx(done, txPending);
    });
    it('--#getTagId', function (done) {
        tagsChannel.callTest.set(channels_1.default.client.tags.getTagId, (injected) => {
            console.log(injected.data.data);
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.tagId).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.tags.getTagId, '', { tagName: 'tag-no1478868259923' });
    });
    it('--#getTagName', function (done) {
        tagsChannel.callTest.set(channels_1.default.client.tags.getTagName, (injected) => {
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.tagName).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.tags.getTagName, '', { tagId: '2' });
    });
    it('--#getTagCount', function (done) {
        tagsChannel.callTest.set(channels_1.default.client.tags.getTagCount, (injected) => {
            console.log(injected.data.data);
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.count).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.tags.getTagCount, '', {});
    });
    it.skip('--#isSubscribed', function (done) {
        tagsChannel.callTest.set(channels_1.default.client.tags.isSubscribed, (injected) => {
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.subscribed).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.tags.isSubscribed, '', { tagId: helpers.tagId, address: helpers.profileAddress });
    });
    it('--#subscribe', function (done) {
        tagsChannel.callTest.set(channels_1.default.client.tags.subscribe, (injected) => {
            console.log(injected.data);
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.tx).to.exist;
            txPending = injected.data.data.tx;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.tags.subscribe, '', { tagName: tagName, token, gas: 2000000 });
    });
    it('--should wait for subscribe tag tx', function (done) {
        helpers.confirmTx(done, txPending);
    });
    it('--gets #subsCount', function (done) {
        tagsChannel.callTest.set(channels_1.default.client.tags.subsCount, (injected) => {
            console.log(injected.data);
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.count).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.tags.subsCount, '', { akashaId: helpers.akashaId });
    });
    it.skip('--#unsubscribe', function (done) {
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
    after(function (done) {
        helpers.stopServices(done);
    });
});
//# sourceMappingURL=TagIPC.test.js.map