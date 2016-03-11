
const Promise = require('bluebird');
const LinvoDb = require('linvodb3');

const ProfileSchema = new LinvoDb('Profiles', {
  addr: { type: String, index: true, unique: true },
  name: { type: String, index: true, unique: true },
  ipfs: String
});

class ProfileModel {

  get schema () {
    return ProfileSchema;
  }

  // Getter functions //

  /*
   * Find a profile by name
   * @param name
   * @returns {addr, name, ipfs}
   */
  getName (name) {
    return new Promise((resolve, reject) => {
      ProfileSchema.findOne({ name }, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });
  }

  /*
   * Find a profile by address
   * @param addr
   * @returns {addr, name, ipfs}
   */
  getAddr (addr) {
    return new Promise((resolve, reject) => {
      ProfileSchema.findOne({ addr }, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });
  }

  /*
   * Find a profile by by Name, or Address
   * @param nameOrAddr
   * @returns {addr, name, ipfs}
   */
  get (nameOrAddr) {
    return new Promise((resolve, reject) => {
      if (nameOrAddr.length < 33) {
        resolve(this.getName(nameOrAddr));
      } else if (nameOrAddr.length === 40 || nameOrAddr.length === 42) {
        resolve(this.getAddr(nameOrAddr));
      } else {
        reject('invalid name or address');
      }
    });
  }

  /*
   * List all profiles
   * @param options {}
   * @returns [{ addr, name, ipfs }]
   */
  list (options = {}) {
    return new Promise((resolve, reject) => {
      ProfileSchema.find(options, (err, docs) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }

  // DO NOT call these functions directly !!
  // They are called by the events from the Profile Contract!

  /*
   * @param addr
   * @param name
   * @param ipfs
   */
  create (addr, name, ipfs) {
    return new Promise((resolve, reject) => {
      const doc = new ProfileSchema({ addr, name, ipfs });
      doc.save((err, docs) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }

  /*
   * @param addr
   * @param ipfs
   */
  update (addr, ipfs) {
    return new Promise((resolve, reject) => {
      ProfileSchema.update({ addr }, { $set: { ipfs } }, {}, (err, num, newDoc) => {
        if (err) {
          reject(err);
        } else {
          resolve(newDoc);
        }
      });
    });
  }

  /*
   * @param addr
   */
  delete (addr) {
    return new Promise((resolve, reject) => {
      ProfileSchema.remove({ addr }, { multi: true }, (err, num) => {
        if (err) {
          reject(err);
        } else {
          resolve(num);
        }
      });
    });
  }

}

export default ProfileModel;
