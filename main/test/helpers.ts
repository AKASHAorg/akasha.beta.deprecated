import Applogger from '../lib/ipc/Logger';
import GethIPC from '../lib/ipc/GethIPC';
import IpfsIPC from '../lib/ipc/IpfsIPC';
import TxIPC from '../lib/ipc/TxIPC';
import { ipcMain } from 'electron';
import { expect } from 'chai';
import channel from '../lib/channels';
import AuthIPC from '../lib/ipc/AuthIPC';

class AuthIPCtest extends AuthIPC {
    public callTest: Map<string, any> = new Map();

    public fireEvent(channel, data, event) {
        const cb = this.callTest.get(channel);
        return cb(fireEvent(channel, data, event));
    }
}

export class GethIPCtest extends GethIPC {
    public callTest: Map<string, any> = new Map();

    public fireEvent(channel, data, event) {
        const cb = this.callTest.get(channel);
        return cb(fireEvent(channel, data, event));
    }
}

export class IpfsIPCtest extends IpfsIPC {
    public callTest: Map<string, any> = new Map();

    public fireEvent(channel, data, event) {
        const cb = this.callTest.get(channel);
        return cb(fireEvent(channel, data, event));
    }
}

export class TxIPCtest extends TxIPC {
    public callTest: Map<string, any> = new Map();

    public fireEvent(channel, data, event) {
        const cb = this.callTest.get(channel);
        return cb(fireEvent(channel, data, event));
    }
}

export const gethChannel = new GethIPCtest();
export const ipfsChannel = new IpfsIPCtest();
export const authChannel = new AuthIPCtest();
export const txChannel = new TxIPCtest();
export const tagId = 2;
export const tagName = 'tag-no1478868171004';
export const pwd = Buffer.from('abc12345');
export const mockedAddress = '0xc7fea2aa9b1475e09f6325e3f6586170f3a1c470';
export const akashaId = 'costelinho';
export const profileAddress = '0x78363144f9d4373c05a29a83260c0ce1b300092a';
export const entryAddress = '0xc7449867e7767c6d5b257dea7740650003ee5080';
export const initLogger = () => {
    return Applogger.getInstance();
};

export const fireEvent = (channel, data, event) => {
    return { channel, data, event };
};

export const startServices = (done) => {
    console.log('### starting services, waiting for #started event ###');
    gethChannel.initListeners(null);
    ipfsChannel.initListeners(null);
    authChannel.initListeners(null);
    txChannel.initListeners(null);
    const running = [];
    gethChannel.callTest.set(channel.client.geth.startService, (injected) => {
        expect(injected.data).to.exist;
        expect(injected.data.error).to.not.exist;
        if (injected.data.data.started) {
            running.push(1);
            if (running.indexOf(1) !== -1 && running.indexOf(2) !== -1) {
                //console.dir(injected, {depth: null, colors: true});
                done();
            }
        }
    });
    ipfsChannel.callTest.set(channel.client.ipfs.startService, (injected) => {
        expect(injected.data).to.exist;
        expect(injected.data.error).to.not.exist;
        if (injected.data.data.started) {
            running.push(2);
            if (running.indexOf(1) !== -1 && running.indexOf(2) !== -1) {
                done();
            }
        }
    });

    ipcMain.emit(channel.server.geth.startService, '', {});
    ipcMain.emit(channel.server.ipfs.startService, '', {});
};

export const stopServices = (done) => {
    gethChannel.callTest.set(channel.client.geth.stopService, (injected) => {
        if (!injected.data.data.spawned) {
            done();
        }
    });
    gethChannel.callTest.set(channel.client.ipfs.stopService, (injected) => {
        return injected;
    });
    ipcMain.emit(channel.server.ipfs.stopService, '', {});
    ipcMain.emit(channel.server.geth.stopService, '', {});
};

export const checkSynced = (done) => {
    let interval;
    gethChannel.callTest.set(
        channel.client.geth.manager,
        (injected) => {
            return injected;
        }
    );
    ipcMain.emit(channel.server.geth.manager, '', {
        channel: channel.server.geth.syncStatus,
        listen: true
    });

    gethChannel.callTest.set(channel.client.geth.syncStatus, (injected) => {
        if (injected.data.data.synced) {
            clearInterval(interval);
            done();
        }
        return injected;
    });
    interval = setInterval(() => ipcMain.emit(channel.server.geth.syncStatus, '', {}), 1000);
};

export const getToken = (done, authData, collect) => {
    authChannel.callTest.set(
        channel.client.auth.login,
        (injected) => {
            expect(injected.data.data.token).to.exist;
            collect(injected.data.data.token);
            done();
        });
    ipcMain.emit(channel.server.auth.login, '', authData);
};

export const getNewAddress = (done, collect) => {
    authChannel.callTest.set(
        channel.client.auth.manager,
        (injected) => {
            return injected;
        }
    );
    ipcMain.emit(channel.server.auth.manager, '', {
        channel: channel.server.auth.generateEthKey,
        listen: true
    });
    authChannel.callTest.set(
        channel.client.auth.generateEthKey,
        (injected) => {
            expect(injected.data).to.exist;
            expect(injected.data.data.address).to.exist;
            expect(injected.data.error).to.not.exist;
            collect(injected.data.data.address);
            done();
        });
    setTimeout(() => {
        ipcMain.emit(channel.server.auth.generateEthKey, '', { password: pwd });
    }, 1000);
};

export const getAethers = (done, address, collect) => {
    authChannel.callTest.set(
        channel.client.auth.requestEther,
        (injected) => {
            expect(injected.data).to.exist;
            expect(injected.data.data.tx).to.exist;
            collect(injected.data.data.tx);
            done();
        }
    );
    ipcMain.emit(channel.server.auth.requestEther, '', { address });
};

export const confirmTx = (done, tx) => {
    txChannel.callTest.set(
        channel.client.tx.addToQueue,
        (injected) => {
            return injected;
        }
    );
    txChannel.callTest.set(
        channel.client.tx.emitMined,
        (injected) => {
            expect(injected.data).to.exist;
            expect(injected.data.data.mined).to.exist;
            if (injected.data.data.mined === tx) {
                done();
            }
        }
    );
    ipcMain.emit(channel.server.tx.addToQueue, '', [{ tx }]);
};
