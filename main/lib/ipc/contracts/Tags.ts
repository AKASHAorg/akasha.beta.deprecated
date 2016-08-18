import * as Promise from 'bluebird';
import BaseContract from './BaseContract';

export default class Tags extends BaseContract {

    constructor(instance: any) {
        super();
        this.contract = Promise.promisifyAll(instance);
        this.contract.exists.callAsync = Promise.promisify(this.contract.exists.call);
        this.contract.getTagAt.callAsync = Promise.promisify(this.contract.getTagAt.call);
        this.contract.getTagId.callAsync = Promise.promisify(this.contract.getTagId.call);
    }

    add(tag: string, gas?: number) {
        const tagTr = this.gethInstance.web3.fromUtf8(tag);
        return this.contract
            .exists
            .callAsync(tagTr)
            .then((found: boolean) => {
                if (found) {
                    throw new Error('Tag already exists');
                }
                return this.contract
                    .addAsync(tag, {gas});
            });
    }

}
