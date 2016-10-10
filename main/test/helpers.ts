import Applogger from '../lib/ipc/Logger';
import GethIPC from '../lib/ipc/GethIPC';
import IpfsIPC from '../lib/ipc/IpfsIPC';
import { ipcMain } from 'electron';
import { expect } from 'chai';
import channel from '../lib/channels';

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

export const gethChannel = new GethIPCtest();
export const ipfsChannel = new IpfsIPCtest();
export const pwd = Buffer.from("abc123");
export const mockedAddress = '0xb9d31a9e8cbddad80eac90852543142f13bebcb3';

export const initLogger = () => {
    return Applogger.getInstance();
};

export const fireEvent = (channel, data, event) => {
    return { channel, data, event };
};

export const startServices = (done) => {
    console.log('starting services, waiting for #started event...');
    gethChannel.initListeners(null);
    ipfsChannel.initListeners(null);
    const running = [];
    gethChannel.callTest.set(channel.client.geth.startService, (injected) => {
        expect(injected.data).to.exist;
        expect(injected.data.error).to.not.exist;
        if (injected.data.data.started) {
            running.push(1);
            if(running.indexOf(1)!==-1 && running.indexOf(2)!==-1){
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
            if(running.indexOf(1)!==-1 && running.indexOf(2)!==-1){
                done();
            }
        }
    });

    ipcMain.emit(channel.server.geth.startService, '', {});
    ipcMain.emit(channel.server.ipfs.startService, '', {});
};

export const stopServices = (done) => {
    gethChannel.callTest.set(channel.client.geth.stopService, (injected) => {
        if(!injected.data.data.spawned){
            done();
        }
    });
    gethChannel.callTest.set(channel.client.ipfs.stopService, (injected) => {
        return injected;
    });
    ipcMain.emit(channel.server.ipfs.stopService);
    ipcMain.emit(channel.server.geth.stopService);

};

export const checktSynced = (done) => {
    let interval;
    gethChannel.callTest.set(
        channel.client.geth.manager,
        (injected) => {
           return injected;
        }
    );
    ipcMain.emit(channel.server.geth.manager, '', { channel: channel.server.geth.syncStatus, listen: true });

    gethChannel.callTest.set(channel.client.geth.syncStatus, (injected) => {
        if(injected.data.data.synced){
            clearInterval(interval);
            done();
        }
        return injected;
    });
    interval = setInterval(()=> ipcMain.emit(channel.server.geth.syncStatus, '', {}), 1000);
};
