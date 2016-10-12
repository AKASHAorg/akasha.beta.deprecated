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

    after(function (done) {
        helpers.stopServices(done);
    });
});
