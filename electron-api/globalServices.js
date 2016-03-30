const geth = require('./modules/geth');
const ipfs = require('./modules/ipfs');

global.gethInstance = geth.getInstance();
global.ipfsInstance = ipfs.getInstance();

global.akasha = {};
