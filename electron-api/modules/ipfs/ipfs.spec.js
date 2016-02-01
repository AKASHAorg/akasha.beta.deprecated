/* eslint strict: 0 */
'use strict';
const ipfsConnector = require('./index');
const expect        = require('chai').expect;

describe('ipfsConnector', function () {
  let ipfs;
  before(function () {
    ipfs = ipfsConnector.getInstance();
  });

  after(function () {
    ipfs.stop();
  });

  it('should prevent from creating objects', function () {
    expect(function () {
      new ipfsConnector();
    }).to.throw(Error);
  });

  it('should provide singleton object', function () {
    expect(ipfs).to.be.an('object');
  });

  describe('#start()', function () {
    this.timeout(10000);
    it('should wait start ipfs daemon process', function (done) {
      expect(function () {
        ipfs.start();
        done();
      }).not.to.throw(Error);
    });

    it('should connect to api server', function (done) {
      expect(ipfs.api).to.be.an('object');
      done();
    });
  });
  describe('#setSchema()', function () {
    before(function () {
      ipfs.stop();
    });
    it('should set rpc schema', function () {
      ipfs.setSchema();
      expect(ipfs._conn).to.be.an('object');
    });
    it('should connect with http protocol', function (done) {
      expect(function () {
        ipfs.start();
        done();
      }).not.to.throw(Error);
    });
  });
});
