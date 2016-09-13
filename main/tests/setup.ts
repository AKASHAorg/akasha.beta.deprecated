/// <reference path="../typings/main.d.ts" />
import { GethConnector, gethHelper, CONSTANTS } from '@akashaproject/geth-connector';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import contracts from '@akashaproject/contracts.js';
import { join as pathJoin } from 'path';
import { Application } from 'spectron';
import { expect } from 'chai';
import * as rimraf from 'rimraf';
import channels from '../lib/channels';
import TestRPC = require('ethereumjs-testrpc');

const binPath = pathJoin(__dirname, 'downloads');
const ethData = pathJoin(__dirname, 'eth-chain');
const ipfsData = pathJoin(__dirname, 'ipfs-dir');

const logger = {
    info: () => {},
    error: console.error,
    warn: console.warn
};

export default class TestsHelper {

    static getElectronPath() {
        let electronPath = pathJoin(__dirname, '..', '..', 'node_modules', '.bin', 'electron');
        if (process.platform === 'win32') electronPath += '.cmd';
        return electronPath;
    }

    static setupTimeout(test: any) {
        if (process.env.CI) {
            test.timeout(60000);
        } else {
            test.timeout(30000);
        }
    }

    static get channels() {
        return channels;
    }

    static startApplication(options: any) {
        options.path = TestsHelper.getElectronPath();
        if (process.env.CI) options.startTimeout = 30000;
        const app = new Application(options);
        return app.start().then(() => {
            rimraf.sync(binPath);
            rimraf.sync(ethData);
            rimraf.sync(ipfsData);
            expect(app.isRunning()).to.be.true;
            TestsHelper.initTestingEnv();
            return app;
        });
    }

    static initTestingEnv() {
        GethConnector.getInstance().setLogger(logger);
        GethConnector.getInstance().setBinPath(binPath);
        GethConnector.getInstance().setOptions({ datadir: ethData });
        GethConnector.getInstance().web3.setProvider(TestRPC.provider());
        GethConnector.getInstance().serviceStatus = { process: false, api: true };

        IpfsConnector.getInstance().setLogger(logger);
        IpfsConnector.getInstance().setBinPath(binPath);
        IpfsConnector.getInstance().setIpfsFolder(ipfsData);
        gethHelper.syncing = false;
    }

    static stopApplication(app: any) {
        rimraf.sync(binPath);
        rimraf.sync(ethData);
        rimraf.sync(ipfsData);
        if (!app || !app.isRunning()) return;

        return app.stop().then(function () {
            expect(app.isRunning()).to.be.false;
        });
    }

    static deployContracts(cb: any) {
        if (!GethConnector.getInstance().web3.currentProvider) {
            throw new Error('web3 needs an api provider');
        }
        console.info('==== INITIATING CONTRACTS ====');
        const cc = new contracts.Class(GethConnector.getInstance().web3);
        return GethConnector.getInstance().web3.eth.getAccountsAsync().then(
            (accList: any[]) => {
                cc.classes.AkashaRegistry.new(
                    { from: accList[0], gas: 3000000, data: '' },
                    (err: any, data: any) => {
                        if (data.address) {
                            console.info(`AkashaRegistry deployed at ${data.address}`);
                            return TestsHelper.deployTags(
                                cc.classes,
                                accList[0],
                                { AkashaRegistry: data },
                                cb
                            );
                        }
                    });
            }
        );
    }

    static deployTags(contracts: any, account: string, resolved: any, cb: any) {
        if (!resolved.AkashaRegistry) {
            throw new Error('AkashaRegistry address is required');
        }
        contracts.AkashaTags.new(
            { from: account, gas: 3000000, data: '' },
            (err: any, data: any) => {
                if (data.address) {
                    console.info(`AkashaTags deployed at ${data.address}`);
                    return TestsHelper.deployIndexedTags(
                        contracts,
                        account,
                        Object.assign(resolved, { AkashaTags: data }),
                        cb
                    );
                }
            }
        );
    }

    static deployIndexedTags(contracts: any, account: string, resolved: any, cb: any) {
        if (!resolved.AkashaTags || !resolved.AkashaRegistry) {
            throw new Error('AkashaTags and AkashaRegistry are required');
        }
        contracts.IndexedTags.new(
            resolved.AkashaTags.address,
            resolved.AkashaRegistry.address,
            { from: account, gas: 3000000, data: '' },
            (err: any, data: any) => {
                if (data.address) {
                    console.info(`IndexedTags deployed at ${data.address}`);
                    return TestsHelper.deployFunds(
                        contracts,
                        account,
                        Object.assign(resolved, { IndexedTags: data }),
                        cb
                    );
                }
            }
        );
    }

    static deployFunds(contracts: any, account: string, resolved: any, cb: any) {
        contracts.AkashaFunds.new(
            { from: account, gas: 3000000, data: '' },
            (err: any, data: any) => {
                if (data.address) {
                    console.info(`AkashaFunds deployed at ${data.address}`);
                    return TestsHelper.deployFaucet(
                        contracts,
                        account,
                        Object.assign(resolved, { AkashaFunds: data }),
                        cb
                    );
                }
            }
        );
    }

    static deployFaucet(contracts: any, account: string, resolved: any, cb: any) {
        contracts.AkashaFaucet.new(
            { from: account, gas: 3000000, data: '' },
            (err: any, data: any) => {
                if (data.address) {
                    console.info(`AkashaFaucet deployed at ${data.address}`);
                    return TestsHelper.deployMain(
                        contracts,
                        account,
                        Object.assign(resolved, { AkashaFaucet: data }),
                        cb
                    );
                }
            }
        );
    }

    static deployMain(contracts: any, account: string, resolved: any, cb: any) {
        contracts.AkashaMain.new(
            resolved.AkashaRegistry.address,
            resolved.IndexedTags.address,
            resolved.AkashaFaucet.address,
            resolved.AkashaFunds.address,
            { from: account, gas: 4500000, data: '' },
            (err: any, data: any) => {
                if (data.address) {
                    console.info(`AkashaMain deployed at ${data.address}`);
                    resolved.IndexedTags.setMain(
                        data.address, { from: account, gas: 1500000, data: '' },
                        (err: Error, final: any) => {
                            console.log(`waiting for tx: ${final}`);
                            GethConnector.getInstance().on(CONSTANTS.TX_MINED, (tx: string) => {
                                if (tx === final) {
                                    console.log('==== CONTRACTS DEPLOYED AND READY ====');
                                    GethConnector.getInstance().removeAllListeners(CONSTANTS.TX_MINED);
                                    cb(Object.assign(resolved, { AkashaMain: data }));
                                }
                            });
                            gethHelper.addTxToWatch(final);
                        });
                }
            }
        );
    }
}
