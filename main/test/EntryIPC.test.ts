import { ipcMain } from 'electron';
import EntryIPC from '../modules/EntryIPC';
import { expect } from 'chai';
import channel from '../channels';
import * as helpers from './helpers';
import entryContent from './fixtures/entryContent';

class EntryIPCtest extends EntryIPC {
    public callTest: Map<string, any> = new Map();

    public fireEvent(channel, data, event) {
        const cb = this.callTest.get(channel);
        return cb(helpers.fireEvent(channel, data, event));
    }
}

describe('EntryIPC', function () {
    this.timeout(60000);
    let entryChannel: EntryIPCtest;
    let token: string;

    before(function (done) {
        expect(helpers.initLogger()).to.exist;
        setTimeout(() => helpers.startServices(done), 400);
    });

    afterEach(function (done) {
        setTimeout(done, 2000);
    });

    it('--constructs channel api', function () {
        entryChannel = new EntryIPCtest();
        expect(entryChannel).to.exist;
    });

    it('--can init listeneres', function () {
        entryChannel.initListeners(null);
        expect(entryChannel.listeners.size).to.be.above(0);
    });

    it('--waits for sync', function (done) {
        helpers.checkSynced(done);
    });

    it('--should add to listened channels from #manager', function (done) {
        let listenersNr = 0;
        const listenOn = [
            channel.server.entry.publish,
            channel.server.entry.update,
            channel.server.entry.upvote,
            channel.server.entry.downvote,
            channel.server.entry.isOpenedToVotes,
            channel.server.entry.getVoteOf,
            channel.server.entry.getEntriesCount,
            channel.server.entry.getEntryOf,
            channel.server.entry.getEntriesCreated,
            channel.server.entry.getVotesEvent
        ];
        entryChannel.callTest.set(
            channel.client.entry.manager,
            (injected) => {
                listenersNr++;
                if (listenersNr === listenOn.length) {
                    done();
                }
            }
        );
        listenOn.forEach((channelName) => {
            ipcMain.emit(channel.server.entry.manager, '', { channel: channelName, listen: true });
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

    it.skip('--should publish an entry', function (done) {
        const content = {
            draft: entryContent,
            title: 'Entry' + new Date().getTime(),
            excerpt: 'Testing excerpt, bla bla bla, test O_O :D :D :D' + new Date().getTime(),
            licence: Math.floor(Math.random() * 10) + 1,
            author: helpers.profileAddress,
            featuredImage: Buffer.alloc(200000, 33)
        };
        const tags = [helpers.tagName];

        entryChannel.callTest.set(
            channel.client.entry.publish,
            (injected) => {
                expect(injected.data.data).to.exist;
                expect(injected.data.data.tx).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.entry.publish, '', { content, tags, token, gas: 2000000 });
    });

    it('--should get entries created', (done) => {
        entryChannel.callTest.set(
            channel.client.entry.getEntriesCreated,
            (injected) => {
                expect(injected.data.data).to.exist;
                expect(injected.data.data.collection).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.entry.getEntriesCreated, '', { index: {}, fromBlock: 0 });
    });

    it('--should get an shortEntry by address', (done) => {
        entryChannel.callTest.set(
            channel.client.entry.getEntry,
            (injected) => {
                expect(injected.data.data.content).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.entry.getEntry, '', { entryAddress: helpers.entryAddress });
    });

    it('--should get an entry of profile/position', (done) => {
        entryChannel.callTest.set(
            channel.client.entry.getEntryOf,
            (injected) => {
                expect(injected.data.data.content).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.entry.getEntryOf, '', { profileAddress: helpers.profileAddress, position: 1 });
    });

    it('--should get an shortEntry much faster', (done) => {
        const started = new Date().getTime();
        entryChannel.callTest.set(
            channel.client.entry.getEntry,
            (injected) => {
                const finished = new Date().getTime() - started;
                expect(finished).to.be.below(50);
                expect(injected.data.data.content).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.entry.getEntry, '', { entryAddress: helpers.entryAddress });
    });

    it('--should get an fullEntry by address', (done) => {
        entryChannel.callTest.set(
            channel.client.entry.getEntry,
            (injected) => {
                expect(injected.data.data.content).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.entry.getEntry, '', { entryAddress: helpers.entryAddress, full: true });
    });

    it('--should get fullEntry much faster', (done) => {
        const started = new Date().getTime();
        entryChannel.callTest.set(
            channel.client.entry.getEntry,
            (injected) => {
                const finished = new Date().getTime() - started;
                expect(finished).to.be.below(50);
                expect(injected.data.data.content).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.entry.getEntry, '', { entryAddress: helpers.entryAddress, full: true });
    });

    it('--should get number of entries published by profile', (done) => {
        entryChannel.callTest.set(
            channel.client.entry.getEntriesCount,
            (injected) => {
                expect(injected.data.data.count).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.entry.getEntriesCount, '', { profileAddress: helpers.profileAddress });
    });

    it('--should get score of entry', (done) => {
        entryChannel.callTest.set(
            channel.client.entry.getScore,
            (injected) => {
                expect(injected.data.data.score).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.entry.getScore, '', { address: helpers.entryAddress });
    });

    it('--checks if entry is opened to votes', (done) => {
        entryChannel.callTest.set(
            channel.client.entry.isOpenedToVotes,
            (injected) => {
                expect(injected.data.data.voting).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.entry.isOpenedToVotes, '', { address: helpers.entryAddress });
    });

    it('--should upvote entry', (done) => {
        entryChannel.callTest.set(
            channel.client.entry.upvote,
            (injected) => {
                expect(injected.data.data.tx).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.entry.upvote, '', {
            address: helpers.entryAddress,
            token,
            weight: 1,
            gas: 2000000
        });
    });

    it('--should downvote entry', (done) => {
        entryChannel.callTest.set(
            channel.client.entry.downvote,
            (injected) => {
                expect(injected.data.data.tx).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.entry.downvote, '', {
            address: helpers.entryAddress,
            token,
            weight: 2,
            gas: 2000000
        });
    });

    it('--should get vote of', (done) => {
        entryChannel.callTest.set(
            channel.client.entry.getVoteOf,
            (injected) => {
                expect(injected.data.data.weight).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.entry.getVoteOf, '', {
            address: helpers.entryAddress,
            profile: helpers.profileAddress
        });
    });

    it('--should get votes of profile from event', (done) => {
        entryChannel.callTest.set(
            channel.client.entry.getVotesEvent,
            (injected) => {
                expect(injected.data.data.collection).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.entry.getVotesEvent, '', {
            index: { profile: helpers.profileAddress },
            fromBlock: 0
        });
    });
    after(function (done) {
        helpers.stopServices(done);
    });
});
