/*
:: Electron example ::

const txs = require('electron').remote.getGlobal('txs');

txs.send({to: '0x123', amount: 1}).then((d)=> console.log('sent!', d)).catch((e)=> console.log('err!', e));

txs.wait().then((d)=> console.log('ok!', d)).catch((e)=> console.log('err!', e));

JSON.stringify(txs.estimate('send'));

*/

export default require('./TransactionApi');
