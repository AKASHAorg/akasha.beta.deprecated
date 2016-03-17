
const Promise = require('bluebird');
const LinvoDb = require('linvodb3');
const web3 = gethInstance.web3;
const contracts = require('../../../contracts/api/contracts');
const ProfileModel = require('../../models/Profiles');
const logger = require('../../loggers').getInstance();
const log = logger.registerLogger('profile', { level: 'info', consoleLevel: 'info' });

class ProfileClass {

  constructor () {
    this.ready = false;
    this.myName = null;
    this.xContract = null;
    this.contract = null;
    this.profileModel = new ProfileModel();

    setTimeout(() => {
      // Setup everything
      this._setupContracts(() => this._setupDatabase());
    }, 5055);
  }

  // Instantiate and wait for AkashaX and Profile Contracts to be ready
  _setupContracts (callback) {
    this.xContract = contracts.instantiateContract('AkashaX',
      contracts.x.abi, contracts.x.address);
    this.contract = contracts.instantiateContract('AkashaProfiles',
      contracts.profile.abi, contracts.profile.address);

    let interval = 0;
    let msgShown = false;

    interval = setInterval(() => {
      this.xContract.blockn.call((err1, block) => {
        if (block && block.toNumber() > 1) {
          web3.eth.getBalance(contracts.x.address, (err2, balance) => {
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
    }, 750);
  }

  // Listen to Profile Contract events
  _setupDatabase () {
    this.xContract.__emitter.on('CreateProfile', (data) => {
      const addr = data.profile;
      this.resolveName(addr).then((name) => {
        this.profileModel.create(addr, name, data.ipfs);
      });
    });

    this.xContract.__emitter.on('UpdateProfile', (data) => {
      this.profileModel.update(data.profile, data.ipfs);
    });

    this.xContract.__emitter.on('DestroyProfile', (data) => {
      this.profileModel.delete(data.profile);
    });

    log.info(`Profile: Setup database ${LinvoDb.dbPath}/Profile.db;`);
  }

  // Ethereum functions (read only)
  // @returns Promise

  resolveName (addr) {
    return new Promise((resolve) => {
      this.xContract.profiles.call(addr, (err, name) => {
        if (err) {
          reject(err);
        } else {
          resolve(web3.toAscii(name).replace(/\u0000/g, ''));
        }
      });
    });
  }

  existsProfileName (name) {
    return new Promise((resolve) => {
      this.xContract.existsProfileName.call(name, (err, exists) => {
        if (err) {
          reject(err);
        } else {
          resolve(exists);
        }
      });
    });
  }

  existsProfileAddr (addr) {
    return new Promise((resolve) => {
      this.xContract.existsProfileAddr.call(addr, (err, exists) => {
        if (err) {
          reject(err);
        } else {
          resolve(exists);
        }
      });
    });
  }

  isProfileOwner (addr, name) {
    return new Promise((resolve) => {
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

  /*
   * Create a new profile;
   * @param `name` must be a string;
   * @param `data` must be an object;
   */
  _create (name, data, callback) {
    const self = this;
    const promise1 = this.existsProfileName(name);
    const promise2 = this.existsProfileAddr(web3.eth.defaultAccount);

    Promise.join(promise1, promise2, (check1, check2) => {
      if (check1) {
        callback('profile name exists');
        return;
      }
      if (check2) {
        callback('profile address exists');
        return;
      }

      data = JSON.stringify(data);
      // Check was ok, now launch!
      ipfsInstance.add(data).then((hash) => {
        // Check
        if (!hash) {
          callback('null ipfs hash');
          return;
        }
        hash = hash[0].Hash;
        // Send and wait transaction
        self.contract.create.waitTransaction(name, hash, {}, (err, success) => {
          if (err) {
            log.warn(err);
            callback(err.toString(), false);
          } else {
            self.myName = name;
            callback(null, success);
          }
        });
      }).catch((err) => {
        log.warn(err);
        callback('ipfs add error');
      });
    });
  }

  create (name, data, callback) {
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

    this._create(name, data, (err) => {
      if (err) {
        this.profileModel.table.removeListener('save', waiting);
        callback(err);
        return;
      }
    });
  }

  /*
   * Update existing profile;
   * @param `name` must be a string;
   * @param `data` must be an object;
   */
  _update (name, data, callback) {
    const self = this;
    const promise1 = this.existsProfileName(name);
    const promise2 = this.isProfileOwner(web3.eth.defaultAccount, name);

    Promise.join(promise1, promise2, (check1, check2) => {
      if (!check1) {
        callback('profile name doesn\'t exist');
        return;
      }
      if (!check2) {
        callback('profile owner error');
        return;
      }

      data = JSON.stringify(data);
      // Check was ok, now launch!
      ipfsInstance.add(data).then((hash) => {
        // Check
        if (!hash) {
          callback('null ipfs hash');
          return;
        }
        hash = hash[0].Hash;
        // Send and wait transaction
        self.contract.update.waitTransaction(name, hash, {}, (err, success) => {
          if (err) {
            log.warn(err);
            callback(err.toString(), false);
          } else {
            callback(null, success);
          }
        });
      }).catch((err) => {
        log.warn(err);
        callback('ipfs add error');
      });
    });
  }

  update (name, data, callback) {
    this.profileModel.getName(name).then((pdoc) => {
      if (!pdoc) {
        callback('profile name doesn\'t exist');
        return;
      }
      ipfsInstance.cat(pdoc.ipfs).then((json) => {
        try {
          json = JSON.parse(json);
        } catch (e) {
          log.warn(e);
          json = {};
        }
        data = Object.assign({}, json, data);

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

        this._update(name, data, (err) => {
          if (err) {
            this.profileModel.table.removeListener('save', waiting);
            callback(err);
            return;
          }
        });
      }).catch((err) => {
        log.warn(err);
        callback(err.toString());
      });
    }).catch((err) => {
      log.warn(err);
      callback(err.toString());
    });
  }

  /*
   * Destroy existing profile;
   * @param `name` must be a string;
   */
  _delete (name, callback) {
    const self = this;
    const promise1 = this.existsProfileName(name);
    const promise2 = this.isProfileOwner(web3.eth.defaultAccount, name);

    Promise.join(promise1, promise2, (check1, check2) => {
      if (!check1) {
        callback('profile name doesn\'t exist');
        return;
      }
      if (!check2) {
        callback('profile owner error');
        return;
      }

      self.contract.destroy.waitTransaction(name, {}, (err, success) => {
        if (err) {
          log.warn(err);
          callback(err.toString(), false);
        } else {
          self.myName = null;
          callback(null, success);
        }
      });
    });
  }

  delete (name, callback) {
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
