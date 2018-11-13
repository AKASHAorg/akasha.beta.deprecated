import * as Promise from 'bluebird';
import { arch, platform, type } from 'os';


const execute = Promise.coroutine(function* () {
    return Promise.resolve({
        platform: {
            platform: platform(),
            arch: arch(),
            type: type()
        },
        resources: {
            memoryUsage: process.getProcessMemoryInfo()
        }
    });
});

export default { execute, name: 'osInfo' };
