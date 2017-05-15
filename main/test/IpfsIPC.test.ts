import { ipcMain } from 'electron';
import { initLogger, ipfsChannel } from './helpers';
import { expect } from 'chai';
import channel from '../lib/channels';

describe('IpfsIPC', function () {
    this.timeout(120000);

    before(function (done) {
        expect(initLogger()).to.exist;
        setTimeout(done, 200);
    });

    it('--constructs channel api', function () {
        expect(ipfsChannel).to.exist;
    });

    it('--can init listeneres', function () {
        expect(ipfsChannel.listeners.size).to.be.above(0);
    });

    it('--should add to listened channels from #manager', function (done) {
        let listenersNr = 0;
        const listenOn = [
            channel.server.ipfs.getConfig,
            channel.server.ipfs.setPorts,
            channel.server.ipfs.getPorts
        ];
        ipfsChannel.callTest.set(
            channel.client.ipfs.manager,
            (injected) => {
                listenersNr++;
                if (listenersNr === listenOn.length) {
                    done();
                }
            }
        );
        listenOn.forEach((channelName) => {
            ipcMain.emit(channel.server.ipfs.manager, '', { channel: channelName, listen: true });
        });
    });

    it('--should #startService', function (done) {
        ipfsChannel.callTest.set(
            channel.client.ipfs.startService,
            (injected) => {
                expect(injected.data).to.exist;
                expect(injected.data.error).to.not.exist;
                if (injected.data.data.started) {
                    done();
                }
            });
        ipcMain.emit(channel.server.ipfs.startService, '', {});
    });

    it('--should get ipfs config #getConfig', function (done) {
        ipfsChannel.callTest.set(
            channel.client.ipfs.getConfig,
            (injected) => {
                expect(injected.data).to.exist;
                expect(injected.data.data.apiPort).to.exist;
                done();
            });
        ipcMain.emit(channel.server.ipfs.getConfig, '', {});
    });

    it('--should #setPorts', function (done) {
        ipfsChannel.callTest.set(
            channel.client.ipfs.setPorts,
            (injected) => {
                expect(injected.data).to.exist;
                expect(injected.data.data.set).to.be.true;
                done();
            });
        ipcMain.emit(channel.server.ipfs.setPorts, '', { ports: { gateway: 8899 } });
    });

    it('--should get #status', function (done) {
        ipfsChannel.callTest.set(
            channel.client.ipfs.status,
            (injected) => {
                expect(injected.data).to.exist;
                expect(injected.data.data.spawned).to.be.true;
                done();
            });
        ipcMain.emit(channel.server.ipfs.status, '', {});
    });

    it('--should #getPorts', function (done) {
        ipfsChannel.callTest.set(
            channel.client.ipfs.getPorts,
            (injected) => {
                expect(injected.data).to.exist;
                expect(injected.data.data.api).to.exist;
                expect(injected.data.error).to.not.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.ipfs.getPorts, '', {});
    });

    after(function (done) {
        ipfsChannel.callTest.set(channel.client.ipfs.stopService, (data) => {
            expect(data.data).to.exist;
            ipfsChannel.callTest.clear();
            done();
        });
        ipcMain.emit(channel.server.ipfs.stopService, '', {});
    });
});
