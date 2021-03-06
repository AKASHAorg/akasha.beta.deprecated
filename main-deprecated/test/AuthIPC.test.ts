import { ipcMain } from 'electron';
import { authChannel, checkSynced, initLogger, mockedAddress, pwd, startServices, stopServices } from './helpers';
import { expect } from 'chai';
import channel from '../channels';
import { setTimeout } from 'timers';

describe('AuthIPC', function () {
    this.timeout(120000);

    before(function (done) {
        expect(initLogger()).to.exist;
        setTimeout(() => startServices(done), 400);
    });

    it('--constructs channel api', function () {
        expect(authChannel).to.exist;
    });

    it('--can init listeneres', function () {
        expect(authChannel.listeners.size).to.be.above(0);
    });

    it('--waits for sync', function (done) {
        checkSynced(done);
    });

    it('--should add to listened channels from #manager', function (done) {
        let listenersNr = 0;
        const listenOn = [
            channel.server.auth.generateEthKey,
            channel.server.auth.getLocalIdentities
        ];
        authChannel.callTest.set(
            channel.client.auth.manager,
            (injected) => {
                listenersNr++;
                if (listenersNr === listenOn.length) {
                    done();
                }
            }
        );
        listenOn.forEach((channelName) => {
            ipcMain.emit(channel.server.auth.manager, '', { channel: channelName, listen: true });
        });
    });

    it.skip('--should create new ethereum address #generateEthKey', function (done) {
        authChannel.callTest.set(
            channel.client.auth.generateEthKey,
            (injected) => {
                expect(injected.data).to.exist;
                expect(injected.data.data.address).to.exist;
                expect(injected.data.error).to.not.exist;
                done();
            });
        ipcMain.emit(channel.server.auth.generateEthKey, '', { password: pwd });
    });

    it('--should request from faucet #requestEther', function (done) {
        authChannel.callTest.set(
            channel.client.auth.requestEther,
            (injected) => {
                expect(injected.data).to.exist;
                expect(injected.data.data.tx).to.exist;
                done();
            }
        );
        ipcMain.emit(channel.server.auth.requestEther, '', { address: mockedAddress });
    });

    it('--should check for profiles #getLocalIdentities', function (done) {
        authChannel.callTest.set(
            channel.client.auth.getLocalIdentities,
            (injected) => {
                expect(injected.data).to.exist;
                expect(injected.data.data).to.be.instanceof(Array);
                done();
            });
        ipcMain.emit(channel.server.auth.getLocalIdentities, '', {});
    });

    it('--should #login', function (done) {
        authChannel.callTest.set(
            channel.client.auth.login,
            (injected) => {
                expect(injected.data).to.exist;
                expect(injected.data.data.token).to.exist;
                done();
            });
        ipcMain.emit(channel.server.auth.login, '', { account: mockedAddress, password: pwd, rememberTime: 1 });
    });

    it('--should #logout', function (done) {
        authChannel.callTest.set(
            channel.client.auth.logout,
            (injected) => {
                expect(injected.data).to.exist;
                expect(injected.data.data.done).to.exist;
                done();
            });
        ipcMain.emit(channel.server.auth.logout, '', {});
    });

    after(function (done) {
        stopServices(done);
    });
});
