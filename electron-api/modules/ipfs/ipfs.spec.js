/* eslint strict: 0 */
'use strict';
const ipfsConnector = require('./index');
const expect        = require('chai').expect;
const Promise       = require('bluebird');

describe('ipfsConnector', function () {
  this.timeout(15000);
  let ipfs;
  before(function () {
    ipfs = ipfsConnector.getInstance();
  });

  after(function () {
    ipfs.stop();
  });

  it('should prevent from creating objects', function () {
    let ipfsClone;
    expect(function () {
      ipfsClone = new ipfsConnector();
    }).to.throw(Error);
  });

  it('should provide singleton object', function () {
    expect(ipfs).to.be.an('object');
  });

  describe('#start()', function () {
    it('should wait start ipfs daemon process', function (done) {
      expect(function () {
        ipfs.start();
        setTimeout(function () {
          done();
        }, 10000);

      }).not.to.throw(Error);
    });

    it('should connect to api server', function (done) {
      expect(ipfs.api).to.be.an('object');
      done();
    });

  });

  describe('#add()', function () {
    let dataString;
    it('should add text to ipfs', function () {
      return ipfs.add(__dirname + '/test.txt', true).then(function (data) {
        dataString = data;
        console.log(data);
        expect(data).to.exist;
      });
    });

    it('should add file to ipfs', function () {
      return ipfs.add(__dirname + '/test.txt').then(function (data) {
        console.log(data);
        expect(dataString).not.to.equal(data);
        expect(data).to.exist;
      });
    });
  });

  describe('#cat()', function () {
    it('should read data from ipfs', function () {
      return ipfs.cat('QmbJWAESqCsf4RFCqEY7jecCashj8usXiyDNfKtZCwwzGb').then(function (data) {
        expect(data).to.equal('{}');
      });
    });

    it('should fail to read', function () {
      return ipfs.cat('dummytext').then(function (data) {
        expect(data).not.to.exist;
      }).catch(function (error) {
        expect(error).to.exist;
      });
    });

    it('should read multiple sources', function () {
      const sources = [
        'QmYTwT2yEHoSZSRvFATUoK9juXJZ7D7BiUBNqG42gLoVWX',
        'QmQuL6hRvE4SZVvccgZisjfvKhswVEKA1LspjbTaEPQJxT',
        'QmbJWAESqCsf4RFCqEY7jecCashj8usXiyDNfKtZCwwzGb'
      ];
      ipfs.catMultiple(sources).then(function (data) {
        expect(data).to.exist;
      }).catch(function (err) {
        expect(err).not.to.exist;
      });
    });
  });


  describe('#getConfig', function () {
    it('should get Datastore key', function () {
      return ipfs.getConfig('Datastore').then(function (config) {
        expect(config).to.exist;
        expect(config).to.be.a('object');
      });
    });

    it('should fail to get undefined config key', function () {
      return ipfs.getConfig('dummykey').then(function (config) {
        expect(config).not.to.exist;
      }).catch(function (err) {
        expect(err).to.exist;
      });
    });
  });

  describe('#setConfig', function () {
    it('should save {key:value} option for ipfs', function () {
      return ipfs.setConfig('exampleKey', 'exampleValue').then(function (config) {
        expect(config).to.exist;
      }).catch(function (err) {
        expect(err).not.to.exist;
      });
    });

    it('should save {object.key:value} option for ipfs', function () {
      return ipfs.setConfig('exampleKeyObject.key', 'exampleValue').then(function (config) {
        expect(config).to.exist;
      }).catch(function (err) {
        expect(err).not.to.exist;
      });
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
