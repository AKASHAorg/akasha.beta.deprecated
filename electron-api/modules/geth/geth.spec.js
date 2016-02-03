/* eslint strict: 0 */
'use strict';
const expect = require('chai').expect;
const geth   = require('./index');
let connector;

describe('gethConnector', function () {
  before(function () {
    connector = geth.getInstance();
  });

  it('should provide executable for geth', function () {
    expect(geth).to.be.an('object');
    const executable = connector.executable;
    expect(executable).to.exist;
  });

  it('should start geth process', function () {
    expect(function () {
      connector.start();
    }).not.to.throw(Error);
  });

  it('should connect to IPC', function () {
    expect(true).to.be.false;
  });

  it('should send rpc to ipc', function () {
    expect(true).to.be.false;
  });

  it('should read data from rpc calls', function () {
    expect(true).to.be.false;
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
