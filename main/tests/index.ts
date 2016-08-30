/// <reference path="../typings/main.d.ts" />
import TestsHelper from './setup';
import { IpfsConnector, ipfsEvents } from '@akashaproject/ipfs-connector';
import { resolve } from 'path';
import { expect } from 'chai';

describe('Auth IPC module', function(){
    TestsHelper.setupTimeout(this);
    const main = resolve(__dirname, '..', '..');
    let app: any;
    before(function () {
        return TestsHelper.startApplication({
            args: [main],
            env: {
                HOT: 1
            }
        }).then((dataObj: any) => {
            app = dataObj;
            app.client.timeoutsImplicitWait(15000);
            app.client.timeoutsAsyncScript(15000);
            return dataObj;
        });
    });

    it('should deploy all contracts', function(done) {
       expect(app).to.be.an('object');
        TestsHelper.deployContracts((data: any) => {
            expect(data).not.to.be.undefined;
            done();
        });
    });

    it('should start ipfs', function(done) {
        IpfsConnector.getInstance().start();
        IpfsConnector.getInstance().on(ipfsEvents.SERVICE_STARTED, () => {
            done();
        });
    });

    // cant test ipc inside spectron https://github.com/electron/spectron/issues/98
    // must use dirty client.executeAsync >_>
    it('should listen for auth.generateEthKey', function() {
        return app.client
            .waitUntilWindowLoaded(1000)
            .executeAsync((done: any) => {
                const ipcRenderer = require('electron').ipcRenderer;
                ipcRenderer.on(window.Channel.client.auth.manager, (status: any) => {
                    done(status);
                });
                ipcRenderer.send(
                    window.Channel.server.auth.manager,
                    {channel: window.Channel.server.auth.generateEthKey, listen: true}
                    );
            })
            .then((ret: any) => {
                expect(ret).not.to.be.undefined;
            });
    });

    after(function() {
       return TestsHelper.stopApplication(app);
    });
});
