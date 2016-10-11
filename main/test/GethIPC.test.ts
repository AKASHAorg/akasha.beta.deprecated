import { ipcMain } from 'electron';
import { initLogger, gethChannel } from './helpers';
import { expect } from 'chai';
import channel from '../lib/channels';


describe('GethIPC', function () {
    this.timeout(60000);

    before(function (done) {
        expect(initLogger()).to.exist;
        setTimeout(done, 200);
    });

    it('--constructs channel api', function () {
        expect(gethChannel).to.exist;
    });

    it('--can init listeneres', function () {
        gethChannel.initListeners(null);
        expect(gethChannel.listeners.size).to.be.above(0);
    });

    it('--should add to listened channels from #manager', function (done) {
        let listenersNr = 0;
        const listenOn = [
            channel.server.geth.syncStatus,
            channel.server.geth.logs,
            channel.server.geth.options
        ];
        gethChannel.callTest.set(
            channel.client.geth.manager,
            (injected) => {
                listenersNr++;
                if (listenersNr === listenOn.length) {
                    done()
                }
            }
        );
        listenOn.forEach((channelName) => {
            ipcMain.emit(channel.server.geth.manager, '', { channel: channelName, listen: true });
        });
    });

    it('--should #startService', function (done) {
        gethChannel.callTest.set(channel.client.geth.startService,
            (injected) => {
                expect(injected.data).to.exist;
                expect(injected.data.error).to.not.exist;
                if (injected.data.data.started) {
                    done();
                }
            });
        ipcMain.emit(channel.server.geth.startService, '', {});
    });

    it('--should get #syncStatus', function (done) {
        gethChannel.callTest.set(channel.client.geth.syncStatus, (injected) => {
            expect(injected.data).to.exist;
            expect(injected.data.data.synced).to.exist;
            done();
        });
        ipcMain.emit(channel.server.geth.syncStatus, '', {});
    });

    it('--should get #logs', function (done) {
        gethChannel.callTest.set(channel.client.geth.logs, (injected) => {
            expect(injected.data).to.exist;
            expect(injected.data.error).to.not.exist;
            expect(injected.data.data.gethInfo).to.exist;
            done();
        });
        ipcMain.emit(channel.server.geth.logs, '', {});
    });

    it('--should get service #status', function (done) {
        gethChannel.callTest.set(channel.client.geth.status, (injected) => {
            expect(injected.data).to.exist;
            expect(injected.data.error).to.not.exist;
            expect(injected.data.data.api).to.exist;
            expect(injected.data.data.spawned).to.exist;
            done();
        });
        ipcMain.emit(channel.server.geth.status, '', {});
    });

    it('--should set geth starting #options', function (done) {
        const fakePath = '/fake/path';
        gethChannel.callTest.set(channel.client.geth.options, (injected) => {
            expect(injected.data).to.exist;
            expect(injected.data.error).to.not.exist;
            expect(injected.data.data.datadir).to.equal(fakePath);
            done();

        });
        ipcMain.emit(channel.server.geth.options, '', { datadir: fakePath });
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
