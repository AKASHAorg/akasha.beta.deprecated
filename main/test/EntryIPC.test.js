"use strict";
const electron_1 = require('electron');
const EntryIPC_1 = require('../lib/ipc/EntryIPC');
const chai_1 = require('chai');
const channels_1 = require('../lib/channels');
const helpers = require('./helpers');
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
describe('TagsIPC', function () {
    this.timeout(60000);
    let entryChannel;
    let token;
    before(function (done) {
        chai_1.expect(helpers.initLogger()).to.exist;
        setTimeout(() => helpers.startServices(done), 400);
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
            channels_1.default.server.entry.getEntryOf
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
    after(function (done) {
        helpers.stopServices(done);
    });
});
//# sourceMappingURL=EntryIPC.test.js.map