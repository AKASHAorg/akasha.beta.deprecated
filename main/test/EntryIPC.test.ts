import { ipcMain } from 'electron';
import EntryIPC from '../lib/ipc/EntryIPC';
import { expect } from 'chai';
import channel from '../lib/channels';
import * as helpers from './helpers';

class EntryIPCtest extends EntryIPC {
    public callTest: Map<string, any> = new Map();

    public fireEvent(channel, data, event) {
        const cb = this.callTest.get(channel);
        return cb(helpers.fireEvent(channel, data, event));
    }
}

describe('TagsIPC', function () {
    this.timeout(60000);
    let entryChannel: EntryIPCtest;
    let token: string;

    before(function (done) {
        expect(helpers.initLogger()).to.exist;
        setTimeout(() => helpers.startServices(done), 400);
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
            channel.server.entry.getEntryOf
        ];
        entryChannel.callTest.set(
            channel.client.entry.manager,
            (injected) => {
                listenersNr++;
                if (listenersNr === listenOn.length) {
                    done()
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

    after(function (done) {
        helpers.stopServices(done);
    });
});
