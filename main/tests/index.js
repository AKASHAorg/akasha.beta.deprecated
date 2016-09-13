"use strict";
const setup_1 = require('./setup');
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
const path_1 = require('path');
const chai_1 = require('chai');
describe('Auth IPC module', function () {
    setup_1.default.setupTimeout(this);
    const main = path_1.resolve(__dirname, '..', '..');
    let app;
    before(function () {
        return setup_1.default.startApplication({
            args: [main],
            env: {
                HOT: 1
            }
        }).then((dataObj) => {
            app = dataObj;
            app.client.timeoutsImplicitWait(15000);
            app.client.timeoutsAsyncScript(15000);
            return dataObj;
        });
    });
    it('should deploy all contracts', function (done) {
        chai_1.expect(app).to.be.an('object');
        setup_1.default.deployContracts((data) => {
            chai_1.expect(data).not.to.be.undefined;
            done();
        });
    });
    it('should start ipfs', function (done) {
        ipfs_connector_1.IpfsConnector.getInstance().start();
        ipfs_connector_1.IpfsConnector.getInstance().on(ipfs_connector_1.ipfsEvents.SERVICE_STARTED, () => {
            done();
        });
    });
    it('should listen for auth.generateEthKey', function () {
        return app.client
            .waitUntilWindowLoaded(1000)
            .executeAsync((done) => {
            const ipcRenderer = require('electron').ipcRenderer;
            ipcRenderer.on(window['Channel'].client.auth.manager, (status) => {
                done(status);
            });
            ipcRenderer.send(window['Channel'].server.auth.manager, { channel: window['Channel'].server.auth.generateEthKey, listen: true });
        })
            .then((ret) => {
            chai_1.expect(ret).not.to.be.undefined;
        });
    });
    after(function () {
        return setup_1.default.stopApplication(app);
    });
});
//# sourceMappingURL=index.js.map