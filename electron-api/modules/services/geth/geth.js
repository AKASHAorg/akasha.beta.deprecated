/* eslint strict: 0 */
'use strict';

const Binary = require('bin-wrapper');
const path = require('path');
const base = 'https://github.com/AkashaProject/geth-testnet/releases/download/1.3.6/';

const geth = new Binary()
  .src(base + 'Geth-Linux64-20160505.tar.bz2', 'linux', 'x64')
  .src(base + 'Geth-Win64-20160505.zip', 'win32', 'x64')
  .src(base + 'Geth-Darwin64-20160505.zip', 'darwin')
  .dest(path.join(__dirname, 'binary'))
  .use(process.platform === 'win32' ? 'geth.exe' : 'geth');


module.exports = geth;
