/* eslint complexity: [2,16] max-statements: [2,26] */

/*
:: Electron example ::

ipc.send('request-tx', {operation: 'send', to: '0x123', amount: 1000});
// Response-tx:: {operation: 'send', to: '0x123', err: false}

ipc.send('request-tx', {operation: 'wait', amount: 100*1000*1000*1000});
// Response-tx:: {operation: 'wait', err: false}

*/

const ipc = require('electron').ipcMain;
const web3 = gethInstance.web3;


function estimate (operation, event) {
  const agas = require('../../../contracts/api/gas');
  if (operation === 'wait') {
    event.sender.send('response-tx', { gas: -1, cost: 0 });
    return;
  }
  const gas = 21037;
  const cost = parseFloat(gas * agas.unit_gas_price).toFixed(4) + ' ' + agas.unit; // eslint-disable-line
  event.sender.send('response-tx', { gas, cost });
}

function send (arg, event) {
  const agas = require('../../../contracts/api/gas');
  const response = { operation: arg.operation, to: arg.to, err: false };
  let balance1 = 0;
  let balance2 = 0;
  web3.eth.getBalanceAsync(arg.to)
    .then((balance) => {
      balance1 = balance.toNumber();
      // console.log(' ~Initial remote balance::', balance1);
      return web3.eth.sendTransactionAsync({
        to:       arg.to,
        value:    arg.amount,
        gas:      22000,
        gasPrice: agas.gas_price
      });
    }).then((txHash) => {
      web3.watchTx('sendEther()', txHash, (err, success) => {
        if (err) {
          response.err = err;
          event.sender.send('response-tx', response);
          return;
        }
        web3.eth.getBalance(arg.to, (_, balance) => {
          balance2 = balance.toNumber();
          // console.log(' ~Final remote balance::', balance2);
          if (balance1 + arg.amount !== balance2) {
            response.err = `balance doesnt match ${balance1 + arg.amount} != ${balance2}`;
          }
          event.sender.send('response-tx', response);
        });
      });
    })
    .catch((err) => {
      response.err = err;
      event.sender.send('response-tx', response);
    });
}

ipc.on('request-tx', (event, arg, extra) => {
  console.log(' ⚛  Request-tx::', arg);

  // The maximum possible cost of the operation on the blockchain;
  if (extra && extra.estimate) {
    estimate(arg.operation, event);
    return;
  }

  const response = { operation: arg.operation, to: arg.to, err: false };

  if (arg.operation === 'send') {
    if (!web3.eth.defaultAccount) {
      response.err = 'coinbase not set';
      event.sender.send('response-tx', response);
      return;
    }
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

    web3.isNodeSyncing((sync) => {
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
