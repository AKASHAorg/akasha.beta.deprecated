import { ipcMain } from 'electron';
import RegistryIPC from '../lib/ipc/RegistryIPC';
import { expect } from 'chai';
import channel from '../lib/channels';
import * as helpers from './helpers';

class RegistryIPCtest extends RegistryIPC {
    public callTest: Map<string, any> = new Map();

    public fireEvent(channel, data, event) {
        const cb = this.callTest.get(channel);
        return cb(helpers.fireEvent(channel, data, event));
    }
}

describe('RegistryIPC', function () {
    this.timeout(120000);
    let registryChannel: RegistryIPCtest;
    let token: string;
    let ethAddress: string;
    let txPending: string;

    before(function (done) {
        expect(helpers.initLogger()).to.exist;
        setTimeout(() => helpers.startServices(done), 400);
    });

    it('--constructs channel api', function () {
        registryChannel = new RegistryIPCtest();
        expect(registryChannel).to.exist;
    });

    it('--can init listeneres', function () {
        registryChannel.initListeners(null);
        expect(registryChannel.listeners.size).to.be.above(0);
    });

    it('--waits for sync', function (done) {
        helpers.checkSynced(done);
    });

    it('--should add to listened channels from #manager', function (done) {
        let listenersNr = 0;
        const listenOn = [
            channel.server.registry.profileExists,
            channel.server.registry.registerProfile
        ];
        registryChannel.callTest.set(
            channel.client.registry.manager,
            (injected) => {
                listenersNr++;
                if (listenersNr === listenOn.length) {
                    done()
                }
            }
        );
        listenOn.forEach((channelName) => {
            ipcMain.emit(channel.server.registry.manager, '', { channel: channelName, listen: true });
        });
    });

    it('--should check if profile exists #profileExists', function (done) {
        registryChannel.callTest.set(
            channel.client.registry.profileExists,
            (injected) => {
                expect(injected.data.data).to.exist;
                expect(injected.data.data.exists).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.registry.profileExists, '', { akashaId: 'costel' });
    });

    it('--should register new address', function (done) {
        helpers.getNewAddress(done, (newAddress) => {
            ethAddress = newAddress;
        });
    });

    it('--should get aethers', function (done) {
        helpers.getAethers(done, ethAddress, (tx) => {
            txPending = tx;
        });
    });

    it('--should get a token', function (done) {
        helpers.getToken(done, {
            account: ethAddress,
            password: helpers.pwd,
            rememberTime: 2,
            registering: true
        }, (generated: string) => {
            token = generated;
        });
    });

    it('--should wait for #pendingTx', function (done) {
        helpers.confirmTx(done, txPending);
    });

    it('--should register new profile #registerProfile', function (done) {
        registryChannel.callTest.set(
            channel.client.registry.registerProfile,
            (injected) => {
                console.log(injected.data);
                expect(injected.data).to.exist;
                expect(injected.data.data.tx).to.exist;
                txPending = injected.data.data.tx;
                console.log(txPending);
                done();
            }
        );
        ipcMain.emit(channel.server.registry.registerProfile, '', {
            token, akashaId: 'costelinho',
            ipfs: {
                firstName: 'Tritza', lastName: 'Fanica' + new Date().getTime(),
                avatar: Buffer.alloc(100000, '1'),
                backgroundImage: {
                    xs: { src: Buffer.alloc(100000, '1'), width: 100, height: 100 },
                    sm: { src: Buffer.alloc(100000, '1'), width: 200, height: 100 },
                    md: { src: Buffer.alloc(100000, '1'), width: 300, height: 100 },
                }
            }
        });
    });

    it('--should wait for registry tx', function (done) {
        helpers.confirmTx(done, txPending);
    });

    after(function (done) {
        helpers.stopServices(done);
    });
});
