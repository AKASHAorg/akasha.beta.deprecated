/* eslint complexity: [2,16] max-statements: [2,26] */

/*
:: Electron example ::

ipc.send('request-tx', {operation: 'send', to: '0x123', amount: 1000});
// Response-tx:: {operation: 'send', to: '0x123', err: false}

ipc.send('request-tx', {operation: 'wait', amount: 100*1000*1000*1000});
// Response-tx:: {operation: 'wait', err: false}

*/

const ipc = require('electron').ipcMain;
const web3 = require('../../../contracts/api/web3');
const estimate = require('../../../contracts/api/gas');
const watchTx = require('../../../contracts/api/watchtx');


function send (arg, event) {
  const response = {operation: arg.operation, to: arg.to, err: false};
  web3.eth.sendTransaction({to: arg.to, value: arg.amount, gas: 21000, gasPrice: estimate.gas_price},
    function (err1, tx) {
      if (err1) {
        response.err = err1.toString().substr(7);
        event.sender.send('response-tx', response);
        return;
      }
      watchTx('sendEther', tx, function (err2, success) {
        if (err2) {
          response.err = err2;
        }
        event.sender.send('response-tx', response);
      });
    });
}

ipc.on('request-tx', function (event, arg, extra) {
  console.log(' ⚛  Request-tx::', arg);

  // The maximum possible cost of the operation on the blockchain;
  if (extra && extra.estimate) {
    if (arg.operation === 'wait') {
      event.sender.send('response-tx', {gas: -1, cost: 0});
      return;
    }
    const gas = 21000;
    const cost = parseFloat(gas * estimate.unit_gas_price).toFixed(4) + ' ' + estimate.unit;
    event.sender.send('response-tx', {gas, cost});
    return;
  }

  const response = {operation: arg.operation, to: arg.to, err: false};

  if (arg.operation === 'send') {
    if (!arg.to || !web3.isAddress(arg.to)) {
      response.err = 'invalid TO address';
      event.sender.send('response-tx', response);
      return;
    }
    if (!arg.amount) {
      response.err = 'empty AMOUNT';
      event.sender.send('response-tx', response);
      return;
    }

    web3.isNodeSyncing(function (sync) {
      if (sync) {
        response.err = 'GETH is not in sync';
        event.sender.send('response-tx', response);
        return;
      }
      console.log(` Sending "${arg.amount} wei" to "${arg.to}"..`);
      send(arg, event);
    });
    return;
  }

  if (arg.operation === 'wait') {
    // TODO: Implement me
    event.sender.send('response-tx', true);
    return;
  }

  event.sender.send('response-tx', false);

});
