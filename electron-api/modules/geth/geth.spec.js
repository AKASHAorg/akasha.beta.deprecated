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

  it('should send rpc to ipc', function (done) {
    connector.ipcCall('eth_coinbase', [], function (err, resp) {
      expect(err).to.be.null;
      done();
    });
  });

  it('should read data from rpc calls', function (done) {
    connector.ipcCall('eth_coinbase', [], function (err, resp) {
      expect(resp).to.exist;
      done();
    });
  });

  it('should unlock account', function () {
    expect(true).to.be.false;
  });

  it('should get blockchain sync status', function () {
    expect(true).to.be.false;
  });

  it('should stop geth process', function () {
    expect(true).to.be.false;
  });

  it('should destroy socket connection to IPC', function () {
    expect(true).to.be.false;
  });

});
