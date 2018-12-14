import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';

const execute = Promise.coroutine(function* (data) {
    const options = GethConnector.getInstance().setOptions(data);
    let mapObj = Object.create(null);
    for (let [k, v] of options) {
        mapObj[k] = v;
    }
    return mapObj;
});

export default { execute, name: 'options' };
