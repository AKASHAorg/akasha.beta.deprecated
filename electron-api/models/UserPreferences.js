const LinvoDb = require('linvodb3');

const schema = {
  idConfig: {
    type:    Number,
    default: 1
  },
  services: {
    gethPath:    String,
    gethPathIpc: String,
    ipfsApiPath: String
  }
};

class UserPreferences {


  constructor (name = 'UserPreferences', options = {}) {
    this.dbTable = new LinvoDb(name, schema, options);
  }

  getConfig (cb) {

  }

  setConfig () {

  }

}

export default UserPreferences;
