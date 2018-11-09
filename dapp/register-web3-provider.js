'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const web3_1 = require('web3');
const Promise = require('bluebird');
exports.regenWeb3 = (web3) => {
  let web3Regen;
  web3Regen = new web3_1.default(web3);
  web3Regen.eth = Promise.promisifyAll(web3Regen.eth);
  web3Regen.shh = Promise.promisifyAll(web3Regen.shh);
  web3Regen.personal = Promise.promisifyAll(web3Regen.personal);
  web3Regen.net = Promise.promisifyAll(web3Regen.net);
  web3Regen.version = Promise.promisifyAll(web3Regen.version);
  return web3Regen;
};
const registerWithExecution = function (nextExecution) {
  window.addEventListener('load', async () => {
    let web3Local;
    if (window.hasOwnProperty('ethereum')) {
      web3Local = exports.regenWeb3(window['ethereum']);
      try {
        await (window['ethereum']).enable();
        web3Local.eth.getAccounts((err, accList) => {
          if (err) {
            throw err;
          }
          nextExecution(web3Local, accList);
        });
      }
      catch (e) {
        nextExecution(web3Local, false);
      }
    }
    else {
      nextExecution(false, false);
    }
  });
};
exports.default = registerWithExecution;
//# sourceMappingURL=register-web3-provider.js.map