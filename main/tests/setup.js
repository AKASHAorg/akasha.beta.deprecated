"use strict";
const geth_connector_1 = require('@akashaproject/geth-connector');
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
const contracts_js_1 = require('@akashaproject/contracts.js');
const path_1 = require('path');
const spectron_1 = require('spectron');
const chai_1 = require('chai');
const rimraf = require('rimraf');
const channels_1 = require('../lib/channels');
const TestRPC = require('ethereumjs-testrpc');
const binPath = path_1.join(__dirname, 'downloads');
const ethData = path_1.join(__dirname, 'eth-chain');
const ipfsData = path_1.join(__dirname, 'ipfs-dir');
const logger = {
    info: () => { },
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
    static get channels() {
        return channels_1.default;
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
            TestsHelper.initTestingEnv();
            return app;
        });
    }
    static initTestingEnv() {
        geth_connector_1.GethConnector.getInstance().setLogger(logger);
        geth_connector_1.GethConnector.getInstance().setBinPath(binPath);
        geth_connector_1.GethConnector.getInstance().setOptions({ datadir: ethData });
        geth_connector_1.GethConnector.getInstance().web3.setProvider(TestRPC.provider());
        geth_connector_1.GethConnector.getInstance().serviceStatus = { process: false, api: true };
        ipfs_connector_1.IpfsConnector.getInstance().setLogger(logger);
        ipfs_connector_1.IpfsConnector.getInstance().setBinPath(binPath);
        ipfs_connector_1.IpfsConnector.getInstance().setIpfsFolder(ipfsData);
        geth_connector_1.gethHelper.syncing = false;
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
    static deployContracts(cb) {
        if (!geth_connector_1.GethConnector.getInstance().web3.currentProvider) {
            throw new Error('web3 needs an api provider');
        }
        console.info('==== INITIATING CONTRACTS ====');
        const cc = new contracts_js_1.default.Class(geth_connector_1.GethConnector.getInstance().web3);
        return geth_connector_1.GethConnector.getInstance().web3.eth.getAccountsAsync().then((accList) => {
            cc.classes.AkashaRegistry.new({ from: accList[0], gas: 3000000, data: '' }, (err, data) => {
                if (data.address) {
                    console.info(`AkashaRegistry deployed at ${data.address}`);
                    return TestsHelper.deployTags(cc.classes, accList[0], { AkashaRegistry: data }, cb);
                }
            });
        });
    }
    static deployTags(contracts, account, resolved, cb) {
        if (!resolved.AkashaRegistry) {
            throw new Error('AkashaRegistry address is required');
        }
        contracts.AkashaTags.new({ from: account, gas: 3000000, data: '' }, (err, data) => {
            if (data.address) {
                console.info(`AkashaTags deployed at ${data.address}`);
                return TestsHelper.deployIndexedTags(contracts, account, Object.assign(resolved, { AkashaTags: data }), cb);
            }
        });
    }
    static deployIndexedTags(contracts, account, resolved, cb) {
        if (!resolved.AkashaTags || !resolved.AkashaRegistry) {
            throw new Error('AkashaTags and AkashaRegistry are required');
        }
        contracts.IndexedTags.new(resolved.AkashaTags.address, resolved.AkashaRegistry.address, { from: account, gas: 3000000, data: '' }, (err, data) => {
            if (data.address) {
                console.info(`IndexedTags deployed at ${data.address}`);
                return TestsHelper.deployFunds(contracts, account, Object.assign(resolved, { IndexedTags: data }), cb);
            }
        });
    }
    static deployFunds(contracts, account, resolved, cb) {
        contracts.AkashaFunds.new({ from: account, gas: 3000000, data: '' }, (err, data) => {
            if (data.address) {
                console.info(`AkashaFunds deployed at ${data.address}`);
                return TestsHelper.deployFaucet(contracts, account, Object.assign(resolved, { AkashaFunds: data }), cb);
            }
        });
    }
    static deployFaucet(contracts, account, resolved, cb) {
        contracts.AkashaFaucet.new({ from: account, gas: 3000000, data: '' }, (err, data) => {
            if (data.address) {
                console.info(`AkashaFaucet deployed at ${data.address}`);
                return TestsHelper.deployMain(contracts, account, Object.assign(resolved, { AkashaFaucet: data }), cb);
            }
        });
    }
    static deployMain(contracts, account, resolved, cb) {
        contracts.AkashaMain.new(resolved.AkashaRegistry.address, resolved.IndexedTags.address, resolved.AkashaFaucet.address, resolved.AkashaFunds.address, { from: account, gas: 4500000, data: '' }, (err, data) => {
            if (data.address) {
                console.info(`AkashaMain deployed at ${data.address}`);
                resolved.IndexedTags.setMain(data.address, { from: account, gas: 1500000, data: '' }, (err, final) => {
                    console.log(`waiting for tx: ${final}`);
                    geth_connector_1.GethConnector.getInstance().on(geth_connector_1.CONSTANTS.TX_MINED, (tx) => {
                        if (tx === final) {
                            console.log('==== CONTRACTS DEPLOYED AND READY ====');
                            geth_connector_1.GethConnector.getInstance().removeAllListeners(geth_connector_1.CONSTANTS.TX_MINED);
                            cb(Object.assign(resolved, { AkashaMain: data }));
                        }
                    });
                    geth_connector_1.gethHelper.addTxToWatch(final);
                });
            }
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TestsHelper;
//# sourceMappingURL=setup.js.map