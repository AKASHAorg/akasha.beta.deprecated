/* eslint no-console: 0 */

const Emitter = require('events').EventEmitter;
const helpers = require('../geth/helpers');
const gas = require('./gas');

const contractCache = {};

function wrapFunction (fname, contract) {
    const web3 = global.gethInstance.web3;
    // console.log(`Wrapped func ${contract.__name}:${fname}()`);
    contract[fname].waitTransaction = function waitTransaction (...args) {
        web3.eth.getBlock('latest', (blockErr, block) => {
            const now = Math.floor(new Date().getTime() / 1000);
            const diff = now - +block.timestamp;
            let oldCallback = null;
            let newCallback = null;
            // Save the callback function
            if (typeof(args[args.length - 1]) === 'function') {
                oldCallback = args.pop(); // Modify the args array!
                if (diff > 120) {
                    oldCallback('GETH is not in sync');
                    return;
                }
            }
            // Overwrite the gazz and gazz price !!
            if (typeof(args[args.length - 1]) === 'object') {
                args[args.length - 1].gas = gas.max_gas;
                args[args.length - 1].gasPrice = gas.gas_price;
            }
            newCallback = function sendTransaction (err, tx) {
                const cname = `${contract.__name}:${fname}()`;
                if (blockErr) {
                    oldCallback(blockErr.toString());
                    return;
                }
                if (err) {
                    oldCallback(err.toString().substr(7));
                    return;
                } else {
                    helpers.watchTx(cname, tx, oldCallback);
                }
            };
            args.push(newCallback);
            contract[fname].sendTransaction.apply(contract, args);
        });
    };
}

function attachEvents (contract) {
    const web3 = global.gethInstance.web3;
    contract.__emitter = new Emitter();
    // Save AllEvents pointer
    contract.__ae = contract.allEvents({}, { fromBlock: 0 }, (err, result) => {
        if (err) {
            console.warn(`Error ${contract.__name} Event:: ${err}`);
        } else {
            const data = result.args;
            // Fix data values
            for (const key of Object.keys(data)) {
                const val = data[key];
                // Big number?
                if (typeof(val) === 'object' && val.toNumber) {
                    data[key] = val.toNumber();
                }
            }
            // Attach event time
            web3.eth.getBlock(result.blockHash, (_, block) => {
                if (block && block.timestamp) {
                    data.timestamp = new Date(block.timestamp * 1000);
                }
                // Broadcast event
                console.log(` e ${contract.__name} ${result.event}::`, data);
                contract.__emitter.emit(result.event.toString(), data);
            });
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
    const contract = global.gethInstance.web3.eth.contract(abi);
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
