import Channel from './lib/channels';
import { ApiRequest, ApiListener } from './ipcPreloader';

function injectApi() {
    const AkashaApi = Object.assign({}, Channel);

    Object.keys(Channel.client).forEach((module) => {
        Object.keys(Channel.client[module]).forEach((method) => {
            AkashaApi.client[module][method] = new ApiListener(Channel.client[module][method], method);
        });
    });

    Object.keys(Channel.server).forEach((module) => {
        Object.keys(Channel.server[module]).forEach((method) => {
            if (method !== 'manager') {
                AkashaApi.server[module][method] = new ApiRequest(
                    Channel.server[module][method],
                    Channel.server[module]['manager'],
                    method
                )
            }
        });
    });
    return AkashaApi;
}
global['Channel'] = injectApi();
