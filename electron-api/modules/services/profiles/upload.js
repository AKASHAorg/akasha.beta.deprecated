const electron = require('electron');
const Promise = require('bluebird');
const mkdirp = require('mkdirp');
const fs = require('fs');

function safeIpfsCat (hash) {
  return new Promise(resolve => {
    if (!global.ipfsInstance._api) {
      resolve(null);
      return false;
    }
    let buff = '';
    global.ipfsInstance._api.cat(hash, (error, response) => {
      if (error) {
        resolve(null);
        return false;
      }
      if (response.readable) {
        response.on('error', () => {
          resolve(null);
        }).on('data', (data) => {
          buff += data;
        }).on('end', () => {
          resolve(buff);
        });
        return true;
      }
      resolve(response);
      return true;
    });
    return true;
  });
}

function safeIpfsGet (hash) {
  return new Promise(resolve => {
    if (!global.ipfsInstance._api) {
      resolve(null);
      return false;
    }
    global.ipfsInstance._api.object.get(hash, (error, obj) => {
      if (error || !obj || !obj.Data) {
        resolve(null);
        return false;
      }
      resolve(true); // resolve(obj.Data);
      return true;
    });
    return true;
  });
}

/**
 * AKASHA profile manifest
 * - meta data
 * - avatar image small
 * - avatar-lg large image
 * - bg-image
 */

const manifest = {
  META_PATH: 'meta.json',
  AVATAR_PATH: 'avatar.png',
  AVATAR_LG_PATH: 'avatar-lg.png',
  BG_IMAGE_PATH: 'bg-image.jpg'
};

export { manifest };

/**
 * Check if the IPFS hash respects the profile folder standard;
 * @param `hash` the IPFS hash of a folder (string);
 * @param `callback` the callback function;
 */
export function checkProfileHash (hash, callback) {
  const response = {
    valid: false, avatar: false
  };
  if (typeof(hash) !== 'string' || hash.length !== 46) {
    callback(response);
  }
  global.ipfsInstance.getFolderLinks(hash).then(folder => {
    if (!folder) {
      callback(response);
      return false;
    }

    Promise.props({
      meta: safeIpfsCat(`${hash}/${manifest.META_PATH}`),
      avatar: safeIpfsGet(`${hash}/${manifest.AVATAR_PATH}`)
      // avatar_lg: safeIpfsGet(`${hash}/${manifest.AVATAR_LG_PATH}`),
      // bg_image: safeIpfsGet(`${hash}/${manifest.BG_IMAGE_PATH}`)
    }).then(check => {
      if (check.meta) {
        try {
          response.meta = JSON.parse(check.meta);
          response.valid = true; // If the root + META are valid
        } catch (e) {
          response.meta = false;
        }
      }
      if (check.avatar) {
        response.avatar = `${hash}/${manifest.AVATAR_PATH}`;
      }
      // if (check.avatar_lg) {
      //   response.avatar_lg = true;
      // }
      // if (check.bg_image) {
      //   response.bg_image = true;
      // }
      // Success !!
      callback(response);
      return true;
    }).catch(() => {
      callback(response);
    });
    return true;
  }).catch(() => {
    callback(response);
  });
}

/**
 * Create a temp profile folder;
 * @internal
 * @param `user` the user name;
 * @param `metaData` an object with extra profile info (first name, last name, etc);
 */
function createProfileFolder (user, metaData = {}) {
  const temp = electron.app.getPath('temp');
  const root = `${temp}/akasha/${user}`;

  return new Promise((resolve, reject) => {
    mkdirp(root, (mkdirErr) => {
      if (mkdirErr) {
        reject(mkdirErr.toString());
        return false;
      }
      // console.log(`Created temp folder ${root};`);
      fs.writeFile(`${root}/${manifest.META_PATH}`, JSON.stringify(metaData), 'utf8', (metaErr) => {
        if (metaErr) {
          reject(metaErr.toString());
          return false;
        }
        resolve(root);
        return true;
      });
      return true;
    });
  });
}

/**
 * Create a temp profile folder and upload it on IPFS;
 * @param `user` the user name;
 * @param `metaData` an object with extra profile info (first name, last name, etc);
 * @param `extra` an object with extra files (avatar, bg image, etc);
 */
export function uploadProfile (user, metaData = {}, extra = {}) {
  return new Promise((resolve, reject) => {
    createProfileFolder(user, metaData).then(folder => {
      // TODO :: Add extra files here ???
      global.ipfsInstance.add(folder, { isPath: true, recursive: true }).then(hash => {
        if (!hash || !hash.length) {
          reject('null ipfs hash');
        } else {
          // console.log(`Upload profile ${user} : ${hash.slice(-2, -1)[0].Hash};`);
          resolve(hash.slice(-2, -1)[0].Hash);
        }
      });
    });
  });
}
