/* eslint strict: 0 */
'use strict';

const Binary = require('bin-wrapper');
const path = require('path');
const base = 'https://github.com/ethereum/go-ethereum/releases/download/v1.4.5/';

const geth = new Binary()
    .src(base + 'geth-Linux64-20160524084000-1.4.5-a269a71.tar.bz2', 'linux', 'x64')
    .src(base + 'Geth-Win64-20160524084915-1.4.5-a269a71.zip', 'win32', 'x64')
    .src(base + 'geth-OSX-20160524084920-1.4.5-a269a71.zip', 'darwin')
    .dest(path.join(__dirname, 'binary'))
    .use(process.platform === 'win32' ? 'geth.exe' : 'geth');


module.exports = geth;
