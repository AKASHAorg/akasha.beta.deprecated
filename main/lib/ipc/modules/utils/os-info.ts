import * as Promise from 'bluebird';
import { platform, arch, type } from 'os';


const execute = Promise.coroutine(function*(){
    let info = yield Promise.resolve({platform: {
                platform: platform(),
                arch: arch(),
                type: type()
            },
            resources: {
                memoryUsage: process.getProcessMemoryInfo()
            }
        });
    return info;
});

export default { execute, name: 'osInfo'};