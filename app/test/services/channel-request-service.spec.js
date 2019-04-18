import { expect } from 'chai';
import ChannelReqService from '../../local-flux/services/channel-request-service';
import IPCChannel from '../utils/ipc-channel';

describe('[Service] channel-request-service', () => {
    let channel = global.IPC = new IPCChannel();
    global.crypto = {};
    global.crypto.getRandomValues = () => Date.now();
    let requestId;
    let listenerCount = 0;
    let testReq;
    it('should register a listener', () => {
        ChannelReqService.addResponseListener();
        listenerCount = channel.getListenerCount();
        expect(listenerCount).to.equal(1);
    });
    it('should generate a requestId', () => {
        requestId = ChannelReqService.generateId();
        expect(requestId).to.not.be.null;
    });
    it('should add a request', () => {
        testReq = {
            module: 'geth',
            method: 'start',
            data: {}
        }
        // ChannelReqService.generateId = spy();
        ChannelReqService.sendRequest(testReq.module, testReq.method, testReq.data);
        // expect(ChannelReqService.generateId).to.be.called;
        expect(ChannelReqService.requestIds[testReq.method].length).to.equal(1);
    });
});