
const Emitter = require('events').EventEmitter;
const web3 = gethInstance.web3;
const helpers = require('../geth/helpers');
const gas = require('./gas');

const contractCache = {};

function wrapFunction (fname, contract) {
  // console.log(`Wrapped func ${contract.__name}:${fname}()`);
  contract[fname].waitTransaction = function (...args) {
    web3.eth.getBlock('latest', (blockErr, block) => {
      const now = Math.floor(new Date().getTime() / 1000);
      const diff = now - +block.timestamp;
      let oldCall = null;
      let newCall = null;
      // Hack the callback function
      if (typeof(args[args.length - 1]) === 'function') {
        oldCall = args.pop(); // Modify the args array!
      }
      // Hack the gazz and gazz price !!
      if (typeof(args[args.length - 1]) === 'object') {
        args[args.length - 1].gas = gas.max_gas;
        args[args.length - 1].gasPrice = gas.gas_price;
      }
      newCall = function (err, tx) {
        const cname = `${contract.__name}:${fname}()`;
        if (blockErr) {
          console.warn(cname, blockErr.toString());
          oldCall(blockErr.toString());
          return;
        }
        if (err) {
          console.warn(cname, err.toString());
          oldCall(err.toString().substr(7));
          return;
        }
        if (diff > 120) {
          oldCall('GETH is not in sync');
          return;
        }
        helpers.watchTx(cname, tx, oldCall);
      };
      args.push(newCall);
      contract[fname].sendTransaction.apply(contract, args);
    });
  };
}

function attachEvents (contract) {
  contract.__emitter = new Emitter();
  // Save web3 AllEvents pointer
  contract.__ae = contract.allEvents({}, { fromBlock: 'latest' }, (err, result) => {
    if (err) {
      console.warn(`Error ${contract.__name} Event:: ${err}`);
    } else {
      const data = result.args;
      // Attach event time
      web3.eth.getBlock(result.blockHash, (_, block) => {
        if (block && block.timestamp) {
          data.timestamp = block.timestamp * 1000;
        }
      });
      // Hack data values
      for (const key of Object.keys(data)) {
        const val = data[key];
        // Big number?
        if (typeof(val) === 'object' && val.toNumber) {
          data[key] = val.toNumber();
        }
      }
      console.log(` e ${contract.__name} ${result.event}::`, data);
      // Broadcast event
      contract.__emitter.emit(result.event.toString(), data);
    }
  });
}

/**
 * Create web3 contract instance and attach event watcher;
 */
export default function instantiateContract (contractName, abi, address) {
  // Load from cache?
  if (contractCache[contractName]) {
    return contractCache[contractName];
  }
  // Create new?
  const contract = web3.eth.contract(abi);
  const instance = contract.at(address);
  // Save name for later
  instance.__name = contractName;
  // Fix all functions from contract
  abi.forEach((json) => {
    if (!json.constant && json.type === 'function') {
      wrapFunction(json.name, instance);
    }
  });
  if (contractName === 'AkashaX' && !instance.__emitter) {
    attachEvents(instance);
  }
  contractCache[contractName] = instance;
  return instance;
}
