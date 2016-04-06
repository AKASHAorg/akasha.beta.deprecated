const Promise = require('bluebird');

/**
 * Returns a list of local {Accounts} with a profile
 * @returns {Promise.<T>|*|Function|any|!ManagedPromise.<*>}
 */
export function getLocalProfiles() {
  let profilesPool = [];
  return gethInstance.web3.eth.getAccountsAsync().then((data) => {
    data.forEach(
      (account) => {
        profilesPool.push(akasha.profileInstance.resolveName(account));
      }
    );
    return Promise.all(profilesPool)
                  .map((userName, index) => {
                    if (userName) {
                      return { userName, address: data[index] };
                    }
                    return false;
                  }).filter((onlyValid) => onlyValid);
  }).catch((err) => err);
}

export function login(address, password, timer) {
  const requirements = [
    akasha.profileInstance.existsProfileAddr(address),
    gethInstance.web3.personal.unlockAccountAsync(address, password, timer)
  ];
  return Promise.all(requirements)
                .then((data) => {
                  const isAccepted = data[0] && data[1];
                  if (isAccepted) {
                    gethInstance.web3.eth.defaultAccount = address;
                  }
                  return isAccepted;
                }).catch(() => false);
}

export function logout(address) {
  return gethInstance.web3.personal.lockAccountAsync(address)
                     .then((done) => done);
}


