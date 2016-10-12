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
            channel.server.registry.registerProfile,
            channel.server.registry.getErrorEvent,
            channel.server.registry.getRegistered
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
        ipcMain.emit(channel.server.registry.profileExists, '', {username: 'costel'});
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

    it('--should get a token', function (done){
        helpers.getToken(done, {account: ethAddress, password: helpers.pwd, rememberTime: 2}, (generated: string) => {
            token = generated;
        });
    });

    it('--should wait for #pendingTx', function (done) {
       helpers.confirmTx(done, txPending);
    });

    it('--should register new profile #registerProfile', function(done) {
       registryChannel.callTest.set(
           channel.client.registry.registerProfile,
           (injected) => {
               expect(injected.data).to.exist;
               expect(injected.data.data.tx).to.exist;
               txPending = injected.data.data.tx;
               done();
           }
       );
        ipcMain.emit(channel.server.registry.registerProfile, '', {token, username: 'user'+ new Date().getTime(),
            ipfs:{firstName: 'costel', lastName: 'ionel' }});
    });

    it('--should wait for registry tx', function (done) {
        helpers.confirmTx(done, txPending);
    });

    after(function (done) {
        helpers.stopServices(done);
    });
});
