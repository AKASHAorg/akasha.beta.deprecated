/* eslint camelcase: 0 key-spacing: 0 */

// Estimate gas usage

const profile = {
  create: 91957,
  update: 31667,
  delete: 20979
};

const entry = {
  create: 50208,
  update: 37770,
  hide:   27566,
  vote:   55612
};

const comment = {
  create: 74300,
  update: 32148,
  delete: 18708,
  vote:   55453
};

// Constants

const conversionMap = {
  kwei:    1000,
  mwei:    1000000,
  gwei:    1000000000,
  shannon: 1000000000,
  nano:    1000000000,
  szabo:   1000000000000,
  micro:   1000000000000,
  finney:  1000000000000000,
  milli:   1000000000000000,
  ether:   1000000000000000000
};

const max_gas = 200 * 1000;
const gas_price = 22 * conversionMap.gwei; // gas price, 22 gwei, into wei

const unit = 'finney';
const unit_gas_price = gas_price / conversionMap[unit]; // gas price, into finney

export { profile, entry, comment, max_gas, gas_price, unit_gas_price, unit };
