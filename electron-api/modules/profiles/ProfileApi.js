
const Promise = require('bluebird');
const LinvoDb = require('linvodb3');
const agas = require('../contracts/gas');
const upload = require('./upload');
const ProfileModel = require('../../models/Profiles');
const logger = require('../../loggers').getInstance();
const log = logger.registerLogger('profile', { level: 'info', consoleLevel: 'info' });

const symbolCheck = Symbol();
const symbol = Symbol();

class ProfileClass {

  /**
   * @param enforcer
   */
  constructor(enforcer) {
    if (enforcer !== symbolCheck) {
      throw new Error('Profile: Cannot construct singleton!');
    }
    this.ready = false;
    this.myName = null;
    this.xContract = null;
    this.contract = null;
    this.profileModel = new ProfileModel();
    setTimeout(() =>
      this._setupContracts(() => this._setupDatabase())
    , 4000);
  }

  /**
   * @returns {*}
   */
  static getInstance() {
    if (!this[symbol]) {
      this[symbol] = new ProfileClass(symbolCheck);
    }
    return this[symbol];
  }

  /**
   * Estimate gas usage for profiles;
   */
  estimate(operation) {
    let cost = '';
    const gas = agas.profile[operation] || -1;
    if (gas > 0) {
      cost = parseFloat(gas * agas.unit_gas_price).toFixed(4) + ' ' + agas.unit; // eslint-disable-line
    }
    return { gas, cost };
  }

  // Instantiate and wait for AkashaX and Profile Contracts to be ready
  _setupContracts(callback) {
    const web3 = global.gethInstance.web3;
    const contracts = require('../contracts/abi');
    const getContract = require('../contracts').instantiateContract;

    let interval = 0;
    let errShown = false;
    let msgShown = false;

    interval = setInterval(() => {
      if (!web3) {
        return;
      }
      this.xContract = getContract('AkashaX', contracts.db.abi,
        contracts.db.address);
      this.contract = getContract('AkashaProfiles', contracts.profile.abi,
        contracts.profile.address);

      this.xContract.blockn.call((err1, block) => {
        if (err1 && !errShown) {
          log.warn(`Profile: ${err1}!`);
          errShown = true;
          return;
        }
        if (block && block.toNumber() > 1) {
          web3.eth.getBalance(contracts.db.address, (err2, balance) => {
            if (balance && balance.toNumber() >= 1) {
              log.info('Profile: Setup contracts OK;');
              this.ready = true;
            } else {
              log.warn('Profile: xContract has no funds !!');
            }
            clearInterval(interval);
            if (typeof(callback) === 'function') {
              callback();
            }
          });
        } else if (!msgShown) {
          log.warn('Profile: Contracts are not ready yet... Waiting...');
          msgShown = true;
        }
      });
    }, 1000);
  }

  // Listen to Profile Contract events
  _setupDatabase() {
    const toAscii = global.gethInstance.web3.toAscii;
    const onUpdate = data => {
      this.xContract.profiles.call(data.profile, (err, avatar) => {
        let [name, ipfs] = avatar;
        name = toAscii(name).replace(/\u0000/g, '');
        upload.checkProfileHash(ipfs, result => {
          if (result.valid) {
            this.profileModel.update(data.profile, name, ipfs);
          }
        });
      });
    };

    this.xContract.__emitter.on('CreateProfile', onUpdate);
    this.xContract.__emitter.on('UpdateProfile', onUpdate);
    this.xContract.__emitter.on('DestroyProfile', data => {
      this.profileModel.delete(data.profile);
    });

    log.info(`Profile: Setup database ${LinvoDb.dbPath}/Profile.db;`);
  }

  _check(name) {
    if (!name) {
      return 'empty profile name';
    }
    if (!global.gethInstance.web3.eth.defaultAccount) {
      return 'default address not set';
    }
    if (!this.ready) {
      return 'profile contracts are not ready';
    }
    return true;
  }

  // Ethereum functions (read only)
  // @returns Promise

  resolveProfile(addr) {
    const toAscii = global.gethInstance.web3.toAscii;
    return new Promise((resolve, reject) => {
      this.xContract.profiles.call(addr, (err, avatar) => {
        if (err) {
          reject(new Error(err.toString()));
        } else if (!avatar[1]) {
          reject(new Error('invalid profile'));
        } else {
          let [name, ipfs] = avatar;
          name = toAscii(name).replace(/\u0000/g, '');
          resolve({ name, ipfs });
        }
      });
    });
  }

  existsProfileName(name) {
    return new Promise((resolve, reject) => {
      this.xContract.existsProfileName.call(name, (err, exists) => {
        if (err) {
          reject(err.toString());
        } else {
          resolve(exists);
        }
      });
    });
  }

  existsProfileAddr(addr) {
    return new Promise((resolve, reject) => {
      this.xContract.existsProfileAddr.call(addr, (err, exists) => {
        if (err) {
          reject(err.toString());
        } else {
          resolve(exists);
        }
      });
    });
  }

  isProfileOwner(addr, name) {
    return new Promise((resolve, reject) => {
      this.xContract.isProfileOwner.call(addr, name, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  // Ethereum functions (will send transactions)
  // @returns Promise

  /**
   * Get a profile by address;
   */
  getAddr(addr, callback) {
    const toAscii = global.gethInstance.web3.toAscii;
    this.resolveProfile(addr).then(obj => {
      // obj = { name, ipfs }
      upload.checkProfileHash(obj.ipfs, check => {
        if (check.meta) {
          obj.meta = check.meta;
        }
        if (check.avatar) {
          obj.avatar = check.avatar;
        }
        obj.addr = addr;
        callback(null, obj);
      });
      return true;
    }).catch(err => {
      callback(err.message);
    });
  }

  /**
   * Get a profile by name;
   */
  getName(name, callback) {
    this.xContract.seliforp.call(name, (_, addr) => {
      this.getAddr(addr, callback);
    });
  }

  /*
   * Find a profile by Name, or Address
   * @param nameOrAddr
   * @returns {addr, name, ipfs, ...}
   */
  get(nameOrAddr) {
    return new Promise((resolve, reject) => {
      if (nameOrAddr.length < 33) {
        this.getName(nameOrAddr, (err, obj) => {
          if (err) {
            reject(err);
          } else {
            resolve(obj);
          }
        });
      } else if (nameOrAddr.length === 40 || nameOrAddr.length === 42) {
        this.getAddr(nameOrAddr, (err, obj) => {
          if (err) {
            reject(err);
          } else {
            resolve(obj);
          }
        });
      } else {
        reject(new Error('invalid name or address'));
      }
    });
  }

  /**
   * Create a new profile;
   * @private
   */
  _create(name, hash, callback) {
    const self = this;
    const promise1 = this.existsProfileName(name);
    const promise2 = this.existsProfileAddr(global.gethInstance.web3.eth.defaultAccount);

    Promise.join(promise1, promise2, (check1, check2) => {
      if (check1) {
        callback('profile name exists');
        return;
      }
      if (check2) {
        callback('profile address exists');
        return;
      }

      log.warn(`Profile: Creating profile name "${name}"...`);
      // Send and wait transaction
      self.contract.create.waitTransaction(name, hash, {}, (err, success) => {
        if (err) {
          log.warn(`Profile create error: ${err}`);
          callback(err.toString(), false);
        } else {
          self.myName = name;
          callback(null, success);
        }
      });
    });
  }

  /**
   * Create a new profile;
   * @param `name` the name of the user (string);
   * @param `hash` the IPFS hash of the folder (string);
   */
  create(name, hash, callback) {
    const check = this._check(name);
    if (check !== true) {
      callback(check);
      return;
    }
    upload.checkProfileHash(hash, response => {
      if (!response.valid) {
        callback('invalid ipfs hash');
        return;
      }
      // Database waiting function;
      const waiting = (doc) => {
        if (doc.name === name) {
          this.profileModel.table.removeListener('save', waiting);
          callback(null, doc);
          return;
        }
      };
      // After inserting new documents;
      this.profileModel.table.on('save', waiting);

      this._create(name, hash, (err) => {
        if (err) {
          this.profileModel.table.removeListener('save', waiting);
          callback(err);
          return;
        }
      });
    });
  }

  /**
   * Update existing profile;
   * @private
   */
  _update(name, hash, callback) {
    const self = this;
    const promise1 = this.existsProfileName(name);
    const promise2 = this.isProfileOwner(global.gethInstance.web3.eth.defaultAccount, name);

    Promise.join(promise1, promise2, (check1, check2) => {
      if (!check1) {
        callback('profile name doesn\'t exist');
        return;
      }
      if (!check2) {
        callback('profile owner error');
        return;
      }
      // Send and wait transaction
      self.contract.update.waitTransaction(name, hash, {}, (err, success) => {
        if (err) {
          log.warn(`Profile update error: ${err}`);
          callback(err.toString(), false);
        } else {
          callback(null, success);
        }
      });
    });
  }

  /**
   * Update existing profile;
   * @param `name` the name of the user (string);
   * @param `hash` the IPFS hash of the folder (string);
   */
  update(name, hash, callback) {
    const check = this._check(name);
    if (check !== true) {
      callback(check);
      return;
    }
    upload.checkProfileHash(hash, response => {
      if (!response.valid) {
        callback('invalid ipfs hash');
        return;
      }
      // Database waiting function;
      const waiting = (doc) => {
        if (doc.name === name) {
          this.profileModel.table.removeListener('save', waiting);
          callback(null, doc);
          return;
        }
      };
      // After updating documents;
      this.profileModel.table.on('save', waiting);

      this._update(name, hash, (err) => {
        if (err) {
          this.profileModel.table.removeListener('save', waiting);
          callback(err);
          return;
        }
      });
    });
  }

  /**
   * Destroy existing profile;
   * @private
   */
  _delete(name, callback) {
    const self = this;
    const promise1 = this.existsProfileName(name);
    const promise2 = this.isProfileOwner(global.gethInstance.web3.eth.defaultAccount, name);

    Promise.join(promise1, promise2, (check1, check2) => {
      if (!check1) {
        callback('profile name doesn\'t exist');
        return;
      }
      if (!check2) {
        callback('profile owner error');
        return;
      }

      log.warn(`Profile: Deleting profile name "${name}"...`);
      self.contract.destroy.waitTransaction(name, {}, (err, success) => {
        if (err) {
          log.warn(`Profile delete error: ${err}`);
          callback(err.toString(), false);
        } else {
          self.myName = null;
          callback(null, success);
        }
      });
    });
  }

  /**
   * Destroy existing profile;
   * @param `name` the name of the user (string);
   */
  delete(name, callback) {
    const check = this._check(name);
    if (check !== true) {
      callback(check);
      return;
    }
    // Database waiting function;
    const waiting = (doc) => {
      if (doc.name === name) {
        this.profileModel.table.removeListener('remove', waiting);
        callback(null, true);
        return;
      }
    };
    // After removing documents;
    this.profileModel.table.on('remove', waiting);

    this._delete(name, (err) => {
      if (err) {
        this.profileModel.table.removeListener('remove', waiting);
        callback(err);
        return;
      }
    });
  }

}

export default ProfileClass;
