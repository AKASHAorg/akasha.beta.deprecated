/* eslint complexity: [2,16] max-statements: [2,32] */

/*
:: Electron example ::

ipc.send('request-profile', {operation: 'info', name: 'test'});
// Response-profile:: Object {operation: "info", info: {...}}

ipc.send('request-profile', {operation: 'delete', name: 'test'});
// Response-profile:: Object {operation: "delete", err: "profile name doesn't exist"}

ipc.send('request-profile', {operation: 'create', name: 'test'});
// Response-profile:: Object {operation: "create", err: false}

ipc.send('request-profile', {operation: 'update', name: 'test', data: {x: 'y'} });
// Response-profile:: Object {operation: "update", err: false}

ipc.send('request-profile', {operation: 'delete', name: 'test'});
// Response-profile:: Object {operation: "delete", err: false}

ipc.send('request-profile', {operation: 'create'}, {estimate: true}); // Estimate gas for operation
// Response-profile:: Object {cost: "5.058 finney", gas: 91957}

*/

const ipc = require('electron').ipcMain;
const Profile = require('./ProfileApi');
const profile = new Profile();


function estimate (operation, event) {
  const agas = require('../../../contracts/api/gas');
  let cost = 0;
  const gas = agas.profile[operation] || -1;
  if (gas > 0) {
    cost = parseFloat(gas * agas.unit_gas_price).toFixed(3) + ' ' + agas.unit; // eslint-disable-line
  }
  event.sender.send('response-profile', { gas, cost });
}

function info (nameOrAddr, event) {
  profile.profileModel.get(nameOrAddr).then((doc) => {
    if (!doc) { doc = { name: '', addr: '', ipfs: '' }; }
    event.sender.send('response-profile', {
      operation: 'info',
      name:      doc.name,
      address:   doc.addr,
      ipfs:      doc.ipfs
    });
  });
}

function check (operation, event, args) {
  const response = { operation, err: false };
  if (!profile.ready) {
    response.err = 'profile contracts are not ready';
    event.sender.send('response-profile', response);
    return false;
  }
  if (!profile) {
    response.err = 'cannot initialize profile';
    event.sender.send('response-profile', response);
    return false;
  }
  if (!args.name) {
    response.err = 'empty profile name';
    event.sender.send('response-profile', response);
    return false;
  }
  if (!args.data) {
    args.data = {};
  }
  return true;
}

function callback (operation, event, err, result) {
  const response = { operation, err: false };
  if (err) {
    response.err = err;
  } else if (!result) {
    response.err = 'null result';
  }
  event.sender.send('response-profile', response);
}


ipc.on('request-profile', (event, arg, extra) => {
  console.log(' ⚛  Request-profile::', arg);

  // The maximum possible cost of the operation on the blockchain;
  if (extra && extra.estimate) {
    estimate(arg.operation, event);
    return;
  }

  // List all profiles
  if (arg.operation === 'list') {
    profile.profileModel.list().then((docs) => {
      event.sender.send('response-profile', { operation: 'list', docs });
    });
    return;
  }

  if (!arg.name) {
    arg.name = profile.myName;
    if (!profile.myName || profile.myName === '') {
      event.sender.send('response-profile', { operation: arg.operation, err: 'empty profile name' });
      return;
    }
  }

  // Info about profile
  if (!arg.operation || arg.operation === 'info') {
    info(arg.name, event);
    return;
  }
  // Create
  if (arg.operation === 'create') {
    if (!check(arg.operation, event, arg)) { return; }
    profile.create(arg.name, arg.data, (e, r) => callback(arg.operation, event, e, r));
    return;
  }
  // Update
  if (arg.operation === 'update') {
    if (!check(arg.operation, event, arg)) { return; }
    profile.update(arg.name, arg.data, (e, r) => callback(arg.operation, event, e, r));
    return;
  }
  // Delete
  if (arg.operation === 'delete') {
    if (!check(arg.operation, event, arg)) { return; }
    profile.delete(arg.name, (e, r) => callback(arg.operation, event, e, r));
    return;
  }

  event.sender.send('response-profile', false);

});
