/* eslint strict: 0 */
'use strict';
const expect = require('chai').expect;
const geth   = require('./index');
let connector;

describe('gethConnector', function () {
  this.timeout(10000);
  before(function (done) {
    connector = geth.getInstance();
    setTimeout(function () {
      connector.start();
    }, 500);

    setTimeout(function () {
      done();
    }, 3500);
  });

  after(function () {
    connector.stop();
  });

  it('should provide executable for geth', function () {
    expect(connector).to.be.an('object');
    const executable = connector.executable;
    expect(executable).to.exist;
  });

  it('should start geth process', function () {
    expect(connector.gethProcess).to.be.an('object');
  });

  it('should send rpc to ipc and read data', function (done) {
    connector.ipcCall('eth_coinbase', []).then(function (data) {
      expect(data).to.exist;
    }).catch(function (err) {
      expect(err).to.be.undefined;
    }).finally(function () {
      done();
    });
  });

  it('should stop geth process', function () {
    connector.stop();
    expect(connector.gethProcess).to.be.null;
  });

})
;
