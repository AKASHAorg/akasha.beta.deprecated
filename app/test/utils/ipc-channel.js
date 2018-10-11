// Mock of an IPC channel for testing purposes

class IPCChannel {
    eventListenerCount = 0;
    send = (requestObj) => {
        const event = new global.window.Event('IPCData', {
            detail: requestObj
        });
    }
    dispatchEvent = (event) => {
        global.document.dispatchEvent(event);
    }
    on = (cb) => {
        this.eventListenerCount += 1;
        return global.document.addEventListener('IPCData', (ev) => {
            return cb(ev, ev.detail);
        });
    }
    getListenerCount = () => this.eventListenerCount;
}

export default IPCChannel;