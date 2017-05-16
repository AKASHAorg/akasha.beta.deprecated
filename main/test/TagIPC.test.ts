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
    let txPending: string;
    let tagName: string;
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
            channel.server.tags.getTagName,
            channel.server.tags.subscribe,
            channel.server.tags.unSubscribe,
            channel.server.tags.getTagCount,
            channel.server.tags.subsCount,
            channel.server.tags.getTagsCreated
        ];
        tagsChannel.callTest.set(
            channel.client.tags.manager,
            (injected) => {
                listenersNr++;
                if (listenersNr === listenOn.length) {
                    done();
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
                console.log(injected.data);
                expect(injected.data.data).to.exist;
                expect(injected.data.data.tx).to.exist;
                txPending = injected.data.data.tx;
                done();
            }
        );
        tagName = 'tag-no' + new Date().getTime();
        ipcMain.emit(channel.server.tags.create, '', { token, tagName: tagName, gas: 2000000 });
    });

    it('--should wait for creating tag tx', function (done) {
        helpers.confirmTx(done, txPending);
    });

    it('--#getTagId', function (done) {
        tagsChannel.callTest.set(
            channel.client.tags.getTagId,
            (injected) => {
                console.log(injected.data.data);
                expect(injected.data.data).to.exist;
                expect(injected.data.data.tagId).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.tags.getTagId, '', { tagName: 'tag-no1478868259923' });
    });

    it('--#getTagName', function (done) {
        tagsChannel.callTest.set(
            channel.client.tags.getTagName,
            (injected) => {
                expect(injected.data.data).to.exist;
                expect(injected.data.data.tagName).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.tags.getTagName, '', { tagId: '2' });
    });
    it('--#getTagCount', function (done) {
        tagsChannel.callTest.set(
            channel.client.tags.getTagCount,
            (injected) => {
                console.log(injected.data.data);
                expect(injected.data.data).to.exist;
                expect(injected.data.data.count).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.tags.getTagCount, '', {});
    });
    it.skip('--#isSubscribed', function (done) {
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
                console.log(injected.data);
                expect(injected.data.data).to.exist;
                expect(injected.data.data.tx).to.exist;
                txPending = injected.data.data.tx;
                done();
            }
        );
        ipcMain.emit(channel.server.tags.subscribe, '', { tagName: tagName, token, gas: 2000000 });
    });

    it('--should wait for subscribe tag tx', function (done) {
        helpers.confirmTx(done, txPending);
    });

    it('--gets #subsCount', function (done) {
        tagsChannel.callTest.set(
            channel.client.tags.subsCount,
            (injected) => {
                console.log(injected.data);
                expect(injected.data.data).to.exist;
                expect(injected.data.data.count).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.tags.subsCount, '', { akashaId: helpers.akashaId });
    });

    it.skip('--#unsubscribe', function (done) {
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

    after(function (done) {
        helpers.stopServices(done);
    });
});
