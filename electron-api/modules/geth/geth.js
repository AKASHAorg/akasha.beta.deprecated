/* eslint strict: 0 */
'use strict';

const Binary = require('bin-wrapper');
const path   = require('path');
const base   = 'https://github.com/ethereum/go-ethereum/releases/download/v1.3.2/';

const geth = new Binary()
  .src(base + 'geth-Linux64-20151125145000-1.3.2-5490437.tar.bz2', 'linux', 'x64')
  .src(base + 'Geth-Win64-20151125103701-1.3.2-5490437.zip', 'win32', 'x64')
  .src(base + 'Geth-Darwin64-20151125103701-1.3.2-5490437.zip', 'darwin')
  .dest(path.join(__dirname, 'binary'))
  .use(process.platform === 'win32' ? 'geth.exe' : 'geth');


module.exports = geth;
