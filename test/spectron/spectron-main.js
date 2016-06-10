/* eslint strict: 0 */
'use strict';
const Application = require('spectron').Application;
const path = require('path');
require('babel-register');
const expect = require('chai').expect;

function getElectronPath () {
    let electronPath = path.join(__dirname, '../../', 'node_modules', '.bin', 'electron');
    if (process.platform === 'win32') electronPath += '.cmd';
    return electronPath;
}

describe('application launch', function () {
    let client;
    let app;
    this.timeout(10000);

    before(() => {
        this.app = new Application({
            path: getElectronPath(),
            args: ['./test/spectron/main.js']
        });
        return this.app.start().then(() => {
            client = this.app.client;
            app = this.app;
            client.timeoutsImplicitWait(5000);
            client.timeoutsAsyncScript(5000);
        });
    });

    after(() => {
        if (this.app && this.app.isRunning()) {
            return this.app.stop();
        }
    });

    it('start geth service', () => {
        return client
            .waitUntilWindowLoaded(7000)
            .executeAsync((done) => {
                ipcRenderer.on('client:geth:startService', (err, status) => {
                    done(status);
                });
                ipcRenderer.send('server:geth:startService');
            })
            .then((ret) => {
                expect(ret.value.success).to.be.true;
            })
            .pause(7000); // wait for ipc connector to get set
    });

    it('receive logger events', () => {
        return client
            .executeAsync((done) => {
                ipcRenderer.on('client:logger:gethInfo', (err, status) => {
                    done(status);
                });
                ipcRenderer.send('server:logger:gethInfo');
            })
            .then((ret) => {
                expect(ret.value.status)
                    .to.have.property('log-geth')
                    .that.is.an('array')
                    .to.have.length.above(1);
            });
    });

    it('stop geth service', () => {
        return client
            .executeAsync((done) => {
                ipcRenderer.on('client:geth:stopService', (err, status) => {
                    done(status);
                });
                ipcRenderer.send('server:geth:stopService');
            })
            .then((ret) => {
                expect(ret.value.success).to.be.true;
            });
    });

    it('start ipfs service', () => {
        return client
            .executeAsync((done) => {
                ipcRenderer.on('client:ipfs:startService', (err, status) => {
                    done(status);
                });
                ipcRenderer.send('server:ipfs:startService');
            })
            .then((ret) => {
                expect(ret.value.success).to.be.true;
            })
            .pause(3000); // wait for the process to live a bit
    });

    it('stop ipfs service', () => {
        return client
            .executeAsync((done) => {
                ipcRenderer.on('client:ipfs:stopService', (err, status) => {
                    done(status);
                });
                ipcRenderer.send('server:ipfs:stopService');
            })
            .then((ret) => {
                expect(ret.value.success).to.be.true;
            });
    });

    it('start geth service with options', () => {
        return client
            .waitUntilWindowLoaded(7000)
            .executeAsync((done) => {
                ipcRenderer.on('client:geth:startService', (err, status) => {
                    done(status);
                });
                ipcRenderer.send('server:geth:startService', {dataDir: "/tmp/spectron-tests", cache: 722});
            })
            .then((ret) => {
                expect(ret.value.success).to.be.true;
            })
            .pause(7000); // wait for ipc connector to get set
    });

});

