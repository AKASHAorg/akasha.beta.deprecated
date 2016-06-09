/* eslint strict: 0 */
'use strict';

const Binary = require('bin-wrapper');
const path = require('path');
const base = 'https://github.com/ethereum/go-ethereum/releases/download/v1.4.6/';

const geth = new Binary()
    .src(base + 'geth-Linux64-20160606174600-1.4.6-0f036f6.tar.bz2', 'linux', 'x64')
    .src(base + 'Geth-Win64-20160606174600-1.4.6-0f036f6.zip', 'win32', 'x64')
    .src(base + 'geth-OSX-20160606174600-1.4.6-0f036f6.zip', 'darwin')
    .dest(path.join(__dirname, 'bin'))
    .use(process.platform === 'win32' ? 'geth.exe' : 'geth');


module.exports = geth;
