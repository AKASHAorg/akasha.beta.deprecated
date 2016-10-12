"use strict";
const RegistryIPC_1 = require('../lib/ipc/RegistryIPC');
const chai_1 = require('chai');
const helpers = require('./helpers');
class RegistryIPCtest extends RegistryIPC_1.default {
    constructor() {
        super(...arguments);
        this.callTest = new Map();
    }
    fireEvent(channel, data, event) {
        const cb = this.callTest.get(channel);
        return cb(helpers.fireEvent(channel, data, event));
    }
}
describe('RegistryIPC', function () {
    this.timeout(120000);
    let registryChannel;
    before(function (done) {
        chai_1.expect(helpers.initLogger()).to.exist;
        setTimeout(() => helpers.startServices(done), 400);
    });
    it('--constructs channel api', function () {
        registryChannel = new RegistryIPCtest();
        chai_1.expect(registryChannel).to.exist;
    });
    it('--can init listeneres', function () {
        registryChannel.initListeners(null);
        chai_1.expect(registryChannel.listeners.size).to.be.above(0);
    });
    after(function (done) {
        helpers.stopServices(done);
    });
});
//# sourceMappingURL=RegistryIPC.test.js.map