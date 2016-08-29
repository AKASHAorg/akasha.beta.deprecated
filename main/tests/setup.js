"use strict";
const geth_connector_1 = require('@akashaproject/geth-connector');
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
const contracts_js_1 = require('@akashaproject/contracts.js');
const path_1 = require('path');
const spectron_1 = require('spectron');
const chai_1 = require('chai');
const rimraf = require('rimraf');
const TestRPC = require('ethereumjs-testrpc');
const binPath = path_1.join(__dirname, 'downloads');
const ethData = path_1.join(__dirname, 'eth-chain');
const ipfsData = path_1.join(__dirname, 'ipfs-dir');
const logger = {
    info: console.info,
    error: console.error,
    warn: console.warn
};
class TestsHelper {
    static getElectronPath() {
        let electronPath = path_1.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron');
        if (process.platform === 'win32')
            electronPath += '.cmd';
        return electronPath;
    }
    static setupTimeout(test) {
        if (process.env.CI) {
            test.timeout(60000);
        }
        else {
            test.timeout(30000);
        }
    }
    static startApplication(options) {
        options.path = TestsHelper.getElectronPath();
        if (process.env.CI)
            options.startTimeout = 30000;
        const app = new spectron_1.Application(options);
        return app.start().then(() => {
            rimraf.sync(binPath);
            rimraf.sync(ethData);
            rimraf.sync(ipfsData);
            chai_1.expect(app.isRunning()).to.be.true;
            geth_connector_1.GethConnector.getInstance().setLogger(logger);
            geth_connector_1.GethConnector.getInstance().setBinPath(binPath);
            geth_connector_1.GethConnector.getInstance().setOptions({ datadir: ethData });
            geth_connector_1.GethConnector.getInstance().web3.setProvider(TestRPC.provider());
            geth_connector_1.GethConnector.getInstance().serviceStatus = { process: false, api: true };
            ipfs_connector_1.IpfsConnector.getInstance().setLogger(logger);
            ipfs_connector_1.IpfsConnector.getInstance().setBinPath(binPath);
            ipfs_connector_1.IpfsConnector.getInstance().setIpfsFolder(ipfsData);
            geth_connector_1.gethHelper.syncing = false;
            return app;
        });
    }
    static stopApplication(app) {
        rimraf.sync(binPath);
        rimraf.sync(ethData);
        rimraf.sync(ipfsData);
        if (!app || !app.isRunning())
            return;
        return app.stop().then(function () {
            chai_1.expect(app.isRunning()).to.be.false;
        });
    }
    static deployContracts() {
        if (!geth_connector_1.GethConnector.getInstance().web3.currentProvider) {
            throw new Error('web3 needs an api provider');
        }
        const cc = new contracts_js_1.default.Class(geth_connector_1.GethConnector.getInstance().web3);
        return geth_connector_1.GethConnector.getInstance().web3.eth.getAccountsAsync().then((accList) => {
            cc.classes.AkashaRegistry.new({ from: accList[0], gas: 3000000, data: '' }, (err, data) => {
                if (data.address) {
                }
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TestsHelper;
//# sourceMappingURL=setup.js.map