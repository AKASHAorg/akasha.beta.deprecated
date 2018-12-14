import * as Promise from 'bluebird';
import { filter } from './set-filter';

const execute = Promise.coroutine(function* (data: { profiles: string[] }) {
    data.profiles.forEach((profileAddress) => {
        filter.appendAddress(profileAddress);
    });
    return Promise.resolve({ profiles: data.profiles });
});

export default { execute, name: 'includeFilter' };
