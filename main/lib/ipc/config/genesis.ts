import { app } from 'electron';
import { writeFileSync, open } from 'fs';
import { join } from 'path';
const writeGenesisFile = () => {
    const genesis = {
        "alloc": {},
        "config": {
            "homesteadBlock": 10
        },
        "coinbase": "0x0000000000000000000000000000000000000000",
        "difficulty": "0x20000",
        "extraData": "",
        "gasLimit": "0x493e00",
        "nonce": "0x0000000193221442",
        "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "timestamp": "0x00"
    };
    const genesisBuffer = Buffer.from(JSON.stringify(genesis));
    writeFileSync(getGenesisPath(), genesisBuffer);
};

export function getGenesisPath() {
    return join(app.getPath('userData'), 'genesis.json')
}

export function checkForGenesis(cb) {
    open(getGenesisPath(), 'r', (err, fd) => {
        if (err) {
            if (err.code === "ENOENT") {
                writeGenesisFile();
                return cb();
            }
            return cb(err);
        }
        return cb();
    });
}
