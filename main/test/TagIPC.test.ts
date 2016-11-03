import { ipcMain } from 'electron';
import TagsIPC from '../lib/ipc/TagsIPC';
import { expect } from 'chai';
import channel from '../lib/channels';
import * as helpers from './helpers';

class TagsIPCtest extends TagsIPC {
    public callTest: Map<string, any> = new Map();

    public fireEvent(channel, data, event) {
        const cb = this.callTest.get(channel);
        return cb(helpers.fireEvent(channel, data, event));
    }
}

describe('TagsIPC', function () {
    this.timeout(60000);
    let tagsChannel: TagsIPCtest;
    let token: string;

    before(function (done) {
        expect(helpers.initLogger()).to.exist;
        setTimeout(() => helpers.startServices(done), 400);
    });

    it('--constructs channel api', function () {
        tagsChannel = new TagsIPCtest();
        expect(tagsChannel).to.exist;
    });

    it('--can init listeneres', function () {
        tagsChannel.initListeners(null);
        expect(tagsChannel.listeners.size).to.be.above(0);
    });

    it('--waits for sync', function (done) {
        helpers.checkSynced(done);
    });

    it('--should add to listened channels from #manager', function (done) {
        let listenersNr = 0;
        const listenOn = [
            channel.server.tags.create,
            channel.server.tags.getTagId,
            channel.server.tags.getTagAt,
            channel.server.tags.isSubscribed,
            channel.server.tags.subscribe,
            channel.server.tags.unsubscribe,
            channel.server.tags.getSubPosition,
            channel.server.tags.getTagsFrom,
            channel.server.tags.getCreateError,
            channel.server.tags.getTagsCreated,
            channel.server.tags.getIndexedTag,
            channel.server.tags.getIndexTagError
        ];
        tagsChannel.callTest.set(
            channel.client.tags.manager,
            (injected) => {
                listenersNr++;
                if (listenersNr === listenOn.length) {
                    done()
                }
            }
        );
        listenOn.forEach((channelName) => {
            ipcMain.emit(channel.server.tags.manager, '', { channel: channelName, listen: true });
        });
    });
    it('--should get a token', function (done) {
        helpers.getToken(done, {
            account: helpers.mockedAddress,
            password: helpers.pwd,
            rememberTime: 4
        }, (generated: string) => {
            token = generated;
        });
    });
    it('--#create', function (done) {
        tagsChannel.callTest.set(
            channel.client.tags.create,
            (injected) => {
                expect(injected.data.data).to.exist;
                expect(injected.data.data.tx).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.tags.create, '', { token, tagName: 'cars' + new Date().getTime(), gas: 2000000 });
    });

    it('--#getTagId', function (done) {
        tagsChannel.callTest.set(
            channel.client.tags.getTagId,
            (injected) => {
                expect(injected.data.data).to.exist;
                expect(injected.data.data.tagId).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.tags.getTagId, '', { tagName: 'cars' });
    });

    it('--#getTagAt', function (done) {
        tagsChannel.callTest.set(
            channel.client.tags.getTagName,
            (injected) => {
                expect(injected.data.data).to.exist;
                expect(injected.data.data.tagName).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.tags.getTagAt, '', { tagId: '2' });
    });

    it('--#getTagAt', function (done) {
        tagsChannel.callTest.set(
            channel.client.tags.getTagAt,
            (injected) => {
                expect(injected.data.data).to.exist;
                expect(injected.data.data.tagName).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.tags.getTagAt, '', { tagId: 2 });
    });

    it('--#isSubscribed', function (done) {
        tagsChannel.callTest.set(
            channel.client.tags.isSubscribed,
            (injected) => {
                expect(injected.data.data).to.exist;
                expect(injected.data.data.subscribed).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.tags.isSubscribed, '', { tagId: helpers.tagId, address: helpers.profileAddress });
    });

    it('--#subscribe', function (done) {
        tagsChannel.callTest.set(
            channel.client.tags.subscribe,
            (injected) => {
                expect(injected.data.data).to.exist;
                expect(injected.data.data.tx).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.tags.subscribe, '', { tagName: helpers.tagName, token, gas: 2000000 });
    });

    it('--#getSubPosition', function (done) {
        tagsChannel.callTest.set(
            channel.client.tags.getSubPosition,
            (injected) => {
                expect(injected.data.data).to.exist;
                expect(injected.data.data.position).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.tags.getSubPosition, '', { tagId: helpers.tagId, address: helpers.profileAddress });
    });

    it('--#unsubscribe', function (done) {
        tagsChannel.callTest.set(
            channel.client.tags.unsubscribe,
            (injected) => {
                expect(injected.data.data).to.exist;
                expect(injected.data.data.tx).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.tags.unsubscribe, '', {
            tagName: helpers.tagName,
            subPosition: 0,
            token,
            gas: 2000000
        });
    });
    it('--#getTagsFrom', function (done) {
        tagsChannel.callTest.set(
            channel.client.tags.getTagsFrom,
            (injected) => {
                expect(injected.data.data).to.exist;
                expect(injected.data.data.tags).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.tags.getTagsFrom, '', { from: 0, to: 10 });
    });

    it('--#getCreateError', function (done) {
        tagsChannel.callTest.set(
            channel.client.tags.getCreateError,
            (injected) => {
                expect(injected.data.data).to.exist;
                expect(injected.data.data.events).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.tags.getCreateError, '', { fromBlock: 0, address: helpers.profileAddress });
    });

    it('--#getTagsCreated', function (done) {
        tagsChannel.callTest.set(
            channel.client.tags.getTagsCreated,
            (injected) => {
                expect(injected.data.data).to.exist;
                expect(injected.data.data.collection).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.tags.getTagsCreated, '', { fromBlock: 0, address: helpers.profileAddress });
    });

    it('--#getIndexedTag', function (done) {
        tagsChannel.callTest.set(
            channel.client.tags.getIndexedTag,
            (injected) => {
                expect(injected.data.data).to.exist;
                expect(injected.data.data.events).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.tags.getIndexedTag, '', { fromBlock: 0, address: helpers.profileAddress });
    });

    it('--#getIndexTagError', function (done) {
        tagsChannel.callTest.set(
            channel.client.tags.getIndexTagError,
            (injected) => {
                expect(injected.data.data).to.exist;
                expect(injected.data.data.events).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.tags.getIndexTagError, '', { fromBlock: 0, address: helpers.profileAddress });
    });
    after(function (done) {
        helpers.stopServices(done);
    });
});
