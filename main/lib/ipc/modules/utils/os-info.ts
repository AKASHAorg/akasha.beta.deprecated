import * as Promise from 'bluebird';
import { platform, arch, type } from 'os';


const execute = Promise.coroutine(function*(data:{ info?: string }){
    const platformInfo = yield Promise.resolve(platform());
    const archInfo = yield Promise.resolve(arch());
    const typeInfo = yield Promise.resolve(type());
    const memory = yield Promise.resolve(process.getProcessMemoryInfo());
    return {platform: {
                platform: platformInfo,
                arch: archInfo,
                type: typeInfo
            },
            resources: {
                memoryUsage: memory
            }
        };
});

export default { execute, name: 'osInfo'};