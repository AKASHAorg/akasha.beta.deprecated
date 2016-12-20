import BaseContract from './BaseContract';
import * as Promise from 'bluebird';

export default class Subs extends BaseContract {
    constructor(instance: any) {
        super();
        this.contract = instance;
        this.contract.subsCount.callAsync = Promise.promisify(this.contract.subsCount.call);
        this.contract.subsFirst.callAsync = Promise.promisify(this.contract.subsFirst.call);
        this.contract.subsLast.callAsync = Promise.promisify(this.contract.subsLast.call);
        this.contract.subsNext.callAsync = Promise.promisify(this.contract.subsNext.call);
        this.contract.subsPrev.callAsync = Promise.promisify(this.contract.subsPrev.call);
        this.contract.isSubscribed.callAsync = Promise.promisify(this.contract.isSubscribed.call);
    }


    public subscribe(tagName: string, gas: number = 2000000) {
        if (!tagName) {
            throw new Error('No tag provided');
        }
        const tagNameTr = this.gethInstance.web3.fromUtf8(tagName);
        return this.evaluateData('subscribe', gas, tagNameTr);
    }

    public unSubscribe(tagName: string, gas: number = 2000000) {
        if (!tagName) {
            throw new Error('No tag provided');
        }
        const tagNameTr = this.gethInstance.web3.fromUtf8(tagName);
        return this.evaluateData('unSubscribe', gas, tagNameTr);
    }

    public subsCount(id: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.subsCount.callAsync(idTr).then((result) => result.toString());
    }

    public subsFirst(id: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.subsFirst.callAsync(idTr).then((result) => result.toString());
    }

    public subsLast(id: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.subsLast.callAsync(idTr).then((result) => result.toString());
    }

    public subsNext(id: string, tagId: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.subsNext.callAsync(idTr, tagId).then((result) => result.toString());
    }

    public subsPrev(id: string, tagId: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.subsPrev.callAsync(idTr, tagId).then((result) => result.toString());
    }

    public isSubscribed(id: string, tagName: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.isSubscribed.callAsync(idTr, tagName);
    }
}
