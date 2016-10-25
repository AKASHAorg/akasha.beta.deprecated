"use strict";
const electron_1 = require('electron');
const EntryIPC_1 = require('../lib/ipc/EntryIPC');
const chai_1 = require('chai');
const channels_1 = require('../lib/channels');
const helpers = require('./helpers');
const entryContent_1 = require('./fixtures/entryContent');
class EntryIPCtest extends EntryIPC_1.default {
    constructor() {
        super(...arguments);
        this.callTest = new Map();
    }
    fireEvent(channel, data, event) {
        const cb = this.callTest.get(channel);
        return cb(helpers.fireEvent(channel, data, event));
    }
}
describe('EntryIPC', function () {
    this.timeout(60000);
    let entryChannel;
    let token;
    before(function (done) {
        chai_1.expect(helpers.initLogger()).to.exist;
        setTimeout(() => helpers.startServices(done), 400);
    });
    afterEach(function (done) {
        setTimeout(done, 2000);
    });
    it('--constructs channel api', function () {
        entryChannel = new EntryIPCtest();
        chai_1.expect(entryChannel).to.exist;
    });
    it('--can init listeneres', function () {
        entryChannel.initListeners(null);
        chai_1.expect(entryChannel.listeners.size).to.be.above(0);
    });
    it('--waits for sync', function (done) {
        helpers.checkSynced(done);
    });
    it('--should add to listened channels from #manager', function (done) {
        let listenersNr = 0;
        const listenOn = [
            channels_1.default.server.entry.publish,
            channels_1.default.server.entry.update,
            channels_1.default.server.entry.upvote,
            channels_1.default.server.entry.downvote,
            channels_1.default.server.entry.isOpenedToVotes,
            channels_1.default.server.entry.getVoteOf,
            channels_1.default.server.entry.getEntriesCount,
            channels_1.default.server.entry.getEntryOf,
            channels_1.default.server.entry.getEntriesCreated,
            channels_1.default.server.entry.getVotesEvent
        ];
        entryChannel.callTest.set(channels_1.default.client.entry.manager, (injected) => {
            listenersNr++;
            if (listenersNr === listenOn.length) {
                done();
            }
        });
        listenOn.forEach((channelName) => {
            electron_1.ipcMain.emit(channels_1.default.server.entry.manager, '', { channel: channelName, listen: true });
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
    it.skip('--should publish an entry', function (done) {
        const content = {
            draft: entryContent_1.default,
            title: 'Entry' + new Date().getTime(),
            excerpt: 'Testing excerpt, bla bla bla, test O_O :D :D :D' + new Date().getTime(),
            licence: Math.floor(Math.random() * 10) + 1,
            author: helpers.profileAddress,
            featuredImage: Buffer.alloc(200000, 33)
        };
        const tags = [helpers.tagName];
        entryChannel.callTest.set(channels_1.default.client.entry.publish, (injected) => {
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.tx).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.entry.publish, '', { content, tags, token, gas: 2000000 });
    });
    it('--should get entries created', (done) => {
        entryChannel.callTest.set(channels_1.default.client.entry.getEntriesCreated, (injected) => {
            chai_1.expect(injected.data.data).to.exist;
            chai_1.expect(injected.data.data.collection).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.entry.getEntriesCreated, '', { index: {}, fromBlock: 0 });
    });
    it('--should get an shortEntry by address', (done) => {
        entryChannel.callTest.set(channels_1.default.client.entry.getEntry, (injected) => {
            chai_1.expect(injected.data.data.content).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.entry.getEntry, '', { entryAddress: helpers.entryAddress });
    });
    it('--should get an entry of profile/position', (done) => {
        entryChannel.callTest.set(channels_1.default.client.entry.getEntryOf, (injected) => {
            chai_1.expect(injected.data.data.content).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.entry.getEntryOf, '', { profileAddress: helpers.profileAddress, position: 1 });
    });
    it('--should get an shortEntry much faster', (done) => {
        const started = new Date().getTime();
        entryChannel.callTest.set(channels_1.default.client.entry.getEntry, (injected) => {
            const finished = new Date().getTime() - started;
            chai_1.expect(finished).to.be.below(50);
            chai_1.expect(injected.data.data.content).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.entry.getEntry, '', { entryAddress: helpers.entryAddress });
    });
    it('--should get an fullEntry by address', (done) => {
        entryChannel.callTest.set(channels_1.default.client.entry.getEntry, (injected) => {
            chai_1.expect(injected.data.data.content).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.entry.getEntry, '', { entryAddress: helpers.entryAddress, full: true });
    });
    it('--should get fullEntry much faster', (done) => {
        const started = new Date().getTime();
        entryChannel.callTest.set(channels_1.default.client.entry.getEntry, (injected) => {
            const finished = new Date().getTime() - started;
            chai_1.expect(finished).to.be.below(50);
            chai_1.expect(injected.data.data.content).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.entry.getEntry, '', { entryAddress: helpers.entryAddress, full: true });
    });
    it('--should get number of entries published by profile', (done) => {
        entryChannel.callTest.set(channels_1.default.client.entry.getEntriesCount, (injected) => {
            chai_1.expect(injected.data.data.count).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.entry.getEntriesCount, '', { profileAddress: helpers.profileAddress });
    });
    it('--should get score of entry', (done) => {
        entryChannel.callTest.set(channels_1.default.client.entry.getScore, (injected) => {
            chai_1.expect(injected.data.data.score).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.entry.getScore, '', { address: helpers.entryAddress });
    });
    it('--checks if entry is opened to votes', (done) => {
        entryChannel.callTest.set(channels_1.default.client.entry.isOpenedToVotes, (injected) => {
            chai_1.expect(injected.data.data.voting).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.entry.isOpenedToVotes, '', { address: helpers.entryAddress });
    });
    it('--should upvote entry', (done) => {
        entryChannel.callTest.set(channels_1.default.client.entry.upvote, (injected) => {
            chai_1.expect(injected.data.data.tx).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.entry.upvote, '', { address: helpers.entryAddress, token, weight: 1, gas: 2000000 });
    });
    it('--should downvote entry', (done) => {
        entryChannel.callTest.set(channels_1.default.client.entry.downvote, (injected) => {
            chai_1.expect(injected.data.data.tx).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.entry.downvote, '', { address: helpers.entryAddress, token, weight: 2, gas: 2000000 });
    });
    it('--should get vote of', (done) => {
        entryChannel.callTest.set(channels_1.default.client.entry.getVoteOf, (injected) => {
            chai_1.expect(injected.data.data.weight).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.entry.getVoteOf, '', { address: helpers.entryAddress, profile: helpers.profileAddress });
    });
    it('--should get votes of profile from event', (done) => {
        entryChannel.callTest.set(channels_1.default.client.entry.getVotesEvent, (injected) => {
            chai_1.expect(injected.data.data.collection).to.exist;
            done();
        });
        electron_1.ipcMain.emit(channels_1.default.server.entry.getVotesEvent, '', { index: { profile: helpers.profileAddress }, fromBlock: 0 });
    });
    after(function (done) {
        helpers.stopServices(done);
    });
});
//# sourceMappingURL=EntryIPC.test.js.map