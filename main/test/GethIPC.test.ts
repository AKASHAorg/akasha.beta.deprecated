import GethIPC from '../lib/ipc/GethIPC';
import { ipcMain } from 'electron';
import { fireEvent, initLogger } from './helpers';
import { expect } from 'chai';
import channel from '../lib/channels';

class GethIPCtest extends GethIPC {
    public callTest: Map<string, any> = new Map();

    public fireEvent(channel, data, event) {
        const cb = this.callTest.get(channel);
        return cb(fireEvent(channel, data, event));
    }
}

describe('GethIPC', function () {
    this.timeout(60000);
    let gethChannel: GethIPCtest;

    before(function (done) {
        expect(initLogger()).to.exist;
        setTimeout(done, 200);
    });

    it('--constructs channel api', function () {
        gethChannel = new GethIPCtest();
        expect(gethChannel).to.exist;
    });

    it('--can init listeneres', function () {
        gethChannel.initListeners(null);
        expect(gethChannel.listeners.size).to.be.above(0);
    });

    it('--should add to listened channels', function (done) {
        let listenersNr = 0;
        const listenOn = [
            channel.server.geth.syncStatus,
            channel.server.geth.logs
        ];
        gethChannel.callTest.set(
            channel.client.geth.manager,
            (injected) => {
                listenersNr++;
                if(listenersNr === listenOn.length){
                    done()
                }
            }
        );
        listenOn.forEach((channelName) => {
            ipcMain.emit(channel.server.geth.manager, '', {channel: channelName, listen: true});
        });
    });

    it('--should #startService', function (done) {
        gethChannel.callTest.set(channel.client.geth.startService, (injected) => {
            expect(injected.data).to.exist;
            expect(injected.data.error).to.not.exist;
            if (injected.data.data.started) {
                done();
            }
        });
        ipcMain.emit(channel.server.geth.startService, {});
    });

    it.skip('--should get #syncStatus', function (done) {
        gethChannel.callTest.set(channel.client.geth.syncStatus, (injected) => {
            expect(injected.data).to.exist;
            expect(injected.data.data.synced).to.exist;
            done();
        });
    });

    after(function (done) {
        gethChannel.callTest.set(channel.client.geth.stopService, (data) => {
            expect(data.data).to.exist;
            gethChannel.callTest.clear();
            done();
        });
        ipcMain.emit(channel.server.geth.stopService);
    });

});
