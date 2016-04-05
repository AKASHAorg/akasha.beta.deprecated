
export function toStringVal(val) {
  return String(val);
}

export function toBoolVal(val) {
  return String(val) === 'true';
}

export function toIntVal(val) {
  return parseInt(val, 10);
}

export function toIntValRestricted(val) {
  const check = parseInt(val, 10);
  if (check > 0 && check <= 6) {
    return check;
  }
  return null;
}

export function toJSONObject(val) {
  try {
    return JSON.parse(val);
  } catch (e) {
    return val;
  }
}

const Promise = require('bluebird');
const agas = require('../contracts/gas');

/**
 * Sign a string and return (hash, v, r, s) used by ecrecover to regenerate the address;
 */
export function signString(text) {
  /* eslint prefer-template: 0 */
  const web3 = global.gethInstance.web3;
  const sha = '0x' + web3.sha3(text);
  return new Promise((resolve, reject) => {
    web3.eth.sign(web3.eth.defaultAccount, sha, (err, sig) => {
      if (err) {
        reject(err);
        return;
      }
      sig = sig.substr(2, sig.length);
      const r = '0x' + sig.substr(0, 64);
      const s = '0x' + sig.substr(64, 64);
      const v = web3.toDecimal(sig.substr(128, 2)) + 27;
      resolve({ sha, v, r, s });
    });
  });
}

const MAX_TRIES = 18;

/**
 * Watch for a particular transaction hash and call the awaiting function when done;
 * `fname` param should be in the form Contract:function()
 */
export function watchTx(fname, txHash, callback) {
  if (!txHash) {
    callback('invalid tx');
    return;
  }

  const web3 = global.gethInstance.web3;
  let blockCounter = MAX_TRIES;
  let filter = web3.eth.filter('latest');

  const failFunction = () => {
    if (filter) {
      filter.stopWatching();
      filter = null;
    }
    console.warn(` !! ${fname} expired !!`);
    callback('tx expired');
  };

  const successFunction = (txInfo) => {
    web3.eth.getTransactionReceiptAsync(txHash).then((result) => {
      if (filter) {
        filter.stopWatching();
        filter = null;
      }
      const gas = result.gasUsed;
      const p0 = txInfo.gasPrice;
      const p1 = web3.fromWei(p0, 'szabo');
      const tot = parseFloat(web3.fromWei(gas * p0, agas.unit)).toFixed(3);
      console.log(` ${fname} gas used ${gas} * price ${p1} szabo => cost ${tot} ${agas.unit} ;`);
      // Return success or failure depending on gas usage
      if (gas >= agas.max_gas) {
        callback('the transaction was rejected');
      } else {
        callback(false, true);
      }
    }).catch((err) => {
      console.warn(` !! ${fname} error :: ${err}`);
    });
  };

  filter.watch((err) => {
    if (err) {
      filter.stopWatching();
      filter = null;
      callback(err.toString());
      return;
    }

    console.log(` ${fname} waiting TX [${txHash.substr(0, 8)}..] ; ` +
      `block ${MAX_TRIES - blockCounter} ;`);
    if (blockCounter <= 0) {
      failFunction();
    } else {
      web3.eth.getTransactionAsync(txHash).then((txInfo) => {
        // If transaction is in pending, the blockHash is null
        if (!txInfo || !txInfo.blockHash) {
          --blockCounter;
        } else {
          successFunction(txInfo);
          blockCounter = -1;
        }
      });
    }
  });
}
