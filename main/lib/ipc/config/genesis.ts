import { app } from 'electron';
import { writeFileSync, open } from 'fs';
import { join } from 'path';
const writeGenesisFile = () => {
    const genesis = {
        "alloc": {},
        "config": { "homesteadBlock": 10, "chainId": 511337, "eip155Block": 10, "eip158Block": 10 },
        "coinbase": "0x0000000000000000000000000000000000000000",
        "difficulty": "0x20000",
        "extraData": "0x616b617368612e616c706861",
        "gasLimit": "0x47b760",
        "nonce": "0x0000000076a16716",
        "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000009",
        "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "timestamp": "0x00"
    };
    const genesisBuffer = Buffer.from(JSON.stringify(genesis));
    writeFileSync(getGenesisPath(), genesisBuffer);
};

export function getGenesisPath() {
    return join(app.getPath('userData'), 'akasha.alpha.json')
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
