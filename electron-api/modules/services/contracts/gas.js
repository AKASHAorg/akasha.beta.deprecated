/* eslint camelcase: 0 key-spacing: 0 */

// Estimate gas usage

const profile = {
  create: 151649,
  update: 46213,
  delete: 28689
};

const entry = {
  create: 115062,
  update: 52297,
  hide: 27566,
  vote: 56133
};

const comment = {
  create: 134795,
  update: 46751,
  delete: 26410,
  vote: 55968
};

// Constants

const conversionMap = {
  kwei: 1000,
  mwei: 1000000,
  gwei: 1000000000,
  shannon: 1000000000,
  nano: 1000000000,
  szabo: 1000000000000,
  micro: 1000000000000,
  finney: 1000000000000000,
  milli: 1000000000000000,
  ether: 1000000000000000000
};

const max_gas = 200 * 1000;
const gas_price = 22 * conversionMap.gwei; // gas price, 22 gwei, into wei

const unit = 'finney';
const unit_gas_price = gas_price / conversionMap[unit]; // gas price, into finney

export { profile, entry, comment, max_gas, gas_price, unit_gas_price, unit };
