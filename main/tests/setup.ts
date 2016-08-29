/// <reference path="../typings/main.d.ts" />
import { GethConnector, gethHelper } from '@akashaproject/geth-connector';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import contracts  from '@akashaproject/contracts.js';
import { join as pathJoin } from 'path';
import { Application } from 'spectron';
import { expect } from 'chai';
import * as rimraf from 'rimraf';
import TestRPC = require('ethereumjs-testrpc');

const binPath = pathJoin(__dirname, 'downloads');
const ethData = pathJoin(__dirname, 'eth-chain');
const ipfsData = pathJoin(__dirname, 'ipfs-dir');

const logger = {
    info: console.info,
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

    static startApplication(options: any) {
        options.path = TestsHelper.getElectronPath();
        if (process.env.CI) options.startTimeout = 30000;
        const app = new Application(options);
        return app.start().then(() => {
            rimraf.sync(binPath);
            rimraf.sync(ethData);
            rimraf.sync(ipfsData);
            expect(app.isRunning()).to.be.true;

            GethConnector.getInstance().setLogger(logger);
            GethConnector.getInstance().setBinPath(binPath);
            GethConnector.getInstance().setOptions({ datadir: ethData });
            GethConnector.getInstance().web3.setProvider(TestRPC.provider());
            GethConnector.getInstance().serviceStatus = { process: false, api: true };

            IpfsConnector.getInstance().setLogger(logger);
            IpfsConnector.getInstance().setBinPath(binPath);
            IpfsConnector.getInstance().setIpfsFolder(ipfsData);
            gethHelper.syncing = false;
            return app;
        });
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

    static deployContracts() {
        if (!GethConnector.getInstance().web3.currentProvider) {
            throw new Error('web3 needs an api provider');
        }
        const cc = new contracts.Class(GethConnector.getInstance().web3);

        return GethConnector.getInstance().web3.eth.getAccountsAsync().then(
            (accList: any[]) => {
                cc.classes.AkashaRegistry.new(
                    {from: accList[0], gas: 3000000, data: ''},
                    (err: any, data: any) => {
                    if (data.address) {
                        //console.log(data);
                    }
                });
            }
        );
    }
}
