const LinvoDb = require('linvodb3');
const ipfs    = require('../modules/ipfs').getInstance();
const geth    = require('../modules/geth');

const configId = 1;

const schema = {
  idConfig: {
    type:    Number,
    default: configId
  },

  isInit: {
    type:    Boolean,
    default: false
  },

  services: {
    gethPath:    String,
    gethPathIpc: String,
    ipfsApiPath: String
  }
};

class UserPreferences {

  /**
   *
   * @param name
   * @param options
   */
  constructor (name = 'UserPreferences', options = {}) {
    this.dbTable       = new LinvoDb(name, schema, options);
    this.defaultConfig = {
      gethPath:    geth.getDefaultDatadir(),
      gethPathIpc: geth.getDefaultDatadir() + '/geth.ipc',
      ipfsApiPath: ipfs.getConnection()
    };
    this.dbTable.find({idConfig: configId}).count((err, records)=> {
      let config;
      if (!err && records == 0) {


        this.dbTable.insert({
          services: this.defaultConfig
        });
      }
    });
  }

  /**
   *
   * @param cb
   * @returns {Array|{index: number, input: string}}
   */
  getServicesConfig (cb) {
    return this.dbTable.findOne({idConfig: configId}).map(function (record) {
      return record.services;
    }).exec(cb);
  }

  /**
   *
   * @param options
   * @param cb
   * @returns {Array|{index: number, input: string}}
   */
  setConfig (options = {}, cb) {
    return this.dbTable.update(
      {
        idConfig: configId
      },
      {
        $set: {
          services: options
        }
      }
    ).exec(cb);
  }

}

export default UserPreferences;
