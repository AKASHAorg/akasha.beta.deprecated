/* eslint strict: 0 */
'use strict';
const expect = require('chai').expect;
const geth   = require('../../../electron-api/modules/geth');
const logger = require('./logger.stub');
let connector;

describe('gethConnector', function () {
  this.timeout(10000);
  before(function (done) {
    connector        = geth.getInstance();
    connector.logger = logger;
    connector.start();

    setTimeout(function () {
      done();
    }, 4500);
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

  it('should send request to ipc and read data', function () {
    return connector.web3.personal.listAccountsAsync().then((data)=> {
      expect(data).to.exist;
    }).catch((error)=> {
      expect(error).not.to.exist;
    });
  });

  it('should get coinbase', function () {
    return connector.web3.eth.getCoinbaseAsync().then((data)=> {
      expect(data).to.exist;
    }).catch((error)=> {
      expect(error).not.to.exist;
    });
  });

  it('should get node status', function () {
    return connector.web3.admin.nodeInfoAsync().then((data)=> {
      expect(data).to.exist;
    }).catch((error)=> {
      expect(error).not.to.exist;
    });
  });

  it('should stop geth process', function () {
    connector.stop();
    expect(connector.gethProcess).to.be.null;
  });

});
