const LinvoDb = require('linvodb3');
const ipfs = require('../modules/ipfs').getInstance();
const geth = require('../modules/geth');

const configId = 1;

const schema = {
  idConfig: {
    type: Number,
    default: configId
  },
  services: {
    gethPath: String,
    gethPathIpc: String,
    ipfsApiPath: String,
    isInit: Boolean
  }
};

class UserPreferences {

  /**
   *
   * @param name
   * @param options
   */
  constructor(name = 'UserPreferences', options = {}) {
    this.dbTable = new LinvoDb(name, schema, options);
    this.defaultConfig = {
      gethPath: geth.getDefaultDatadir(),
      gethPathIpc: `${geth.getDefaultDatadir()}/geth.ipc`,
      ipfsApiPath: ipfs.getConnection(),
      isInit: false
    };
    this.dbTable.find({ idConfig: configId }).count((err, records) => {
      if (!err && records === 0) {
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
  getServicesConfig(cb) {
    return this.dbTable.findOne({ idConfig: configId }).map((record) => record.services).exec(cb);
  }

  /**
   *
   * @param options
   * @param cb
   * @returns {Array|{index: number, input: string}}
   */
  setConfig(options = {}) {
    return this.dbTable.update(
      {
        idConfig: configId
      },
      {
        $set: {
          services: options
        }
      },
      {
        multi: false
      }
    );
  }

}

export default UserPreferences;
